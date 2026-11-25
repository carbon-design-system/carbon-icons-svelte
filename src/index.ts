import type { IconOutput, ModuleName } from "@carbon/icons";
import metadata_latest from "@carbon/icons/metadata.json" with { type: "json" };
import { createHash } from "node:crypto";
import { mkdir, readdir, rm, unlink } from "node:fs/promises";
import deprecatedIcons from "./deprecated-icons.json" with { type: "json" };
import pkg from "../package.json" with { type: "json" };
import { buildAnimated } from "./animated/index.js";
import { renderContent, template, templateSvg } from "./template.js";

const VERSION = pkg.devDependencies["@carbon/icons"];

type IconEntry = (typeof metadata_latest.icons)[number];

/**
 * Similarly, `@carbon/icons` may rename icons between minor versions.
 * Maintain a list of renamed icons that are merged in and a mapping of
 * the old export name to the new export name.
 */
const RENAMED_ICONS = {
  // From 11.81.x
  NavaidVordme: "NavaidVorDme", // NavaidVordme -> NavaidVorDme
  NavaidVortac: "NavaidVorTac", // NavaidVortac -> NavaidVorTac
  SoftwareResourceResource: "SoftwareResourceReference", // SoftwareResourceResource -> SoftwareResourceReference
  // From 11.91.x
  IbmQuantumSafeAdvisor: "IbmQuantumSafeCryptographyManager", // IbmQuantumSafeAdvisor -> IbmQuantumSafeCryptographyManager
  IbmQuantumSafeRemediator: "IbmQuantumSafeProxy", // IbmQuantumSafeRemediator -> IbmQuantumSafeProxy
} as const;

const SIZE_PATTERN = /(16|20|24|32)/;
const GLYPH_SUFFIX_PATTERN = /Glyph$/;
const LEADING_UNDERSCORE_PATTERN = /^\_/;

const templateAlias = (moduleName: string) => `<script>
  import ${moduleName} from "./${moduleName}.svelte";

  export let size = 16;

  export let title = undefined;
</script>

<${moduleName} {size} {title} {...$$restProps} />`;

/** Old and new module names that differ only by case share one path on case-insensitive filesystems. */
const collidesOnCaseInsensitiveFs = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

const formatIconIndexLine = (moduleName: string) => {
  const escaped = moduleName.replace(LEADING_UNDERSCORE_PATTERN, "\\_");
  const aliasTarget = RENAMED_ICONS[moduleName as keyof typeof RENAMED_ICONS];

  if (aliasTarget) {
    return `- ${escaped} (alias of ${aliasTarget})`;
  }

  return `- ${escaped}`;
};

/**
 * Writes `files` to `dir`, removing any existing entries not in `files`
 * or `keep`.
 * Overwriting in place is much faster than wiping and recreating the
 * directory's thousands of files. Stale entries are removed before
 * writing so that a case-only rename is not clobbered on
 * case-insensitive filesystems.
 */
const syncDir = async (dir: string, files: Map<string, string>, keep: string[] = []) => {
  await mkdir(dir, { recursive: true });

  await Promise.all(
    (await readdir(dir))
      .filter((file) => !files.has(file) && !keep.includes(file))
      .map((file) => rm(`${dir}/${file}`, { recursive: true, force: true }))
  );

  await Promise.all(
    Array.from(files, ([file, content]) => Bun.write(`${dir}/${file}`, content))
  );
};

const metadata = { ...metadata_latest };

/**
 * This library is built using the `@carbon/icons` package.
 * However, `@carbon/icons` may remove icons between minor versions.
 * This library has a different contract; icons are not removed
 * in minor versions. To ensure that icons are not removed, we
 * merge in a precomputed list of icons pulled from older
 * `@carbon/icons` versions that no longer ship them.
 *
 * `deprecated-icons.json` is a small extract (not the full, multi-MB
 * metadata.json of those older versions). Regenerate it with
 * `bun scripts/generate-deprecated-icons.ts` after adding a new
 * entry to DEPRECATED_ICONS in that script.
 */
metadata.icons.push(...(deprecatedIcons as IconEntry[]));

export const buildIcons = async () => {
  console.time("buildIcons");
  const iconMap = new Map<ModuleName, IconOutput>();
  const iconMetadataMap = new Map<string, typeof metadata.icons[0]>();
  metadata.icons.forEach((icon) => {
    iconMetadataMap.set(icon.name, icon);
  });

  const iconModuleNames = metadata.icons
    .map((icon) =>
      icon.output.map((icon) => {
        let moduleName = icon.moduleName;

        if (SIZE_PATTERN.test(moduleName.slice(-2))) {
          moduleName = icon.moduleName.slice(0, -2);
        }

        if (iconMap.has(moduleName)) return undefined;

        iconMap.set(moduleName, icon);
        return moduleName;
      })
    )
    .flat()
    .filter(Boolean)
    .sort() as string[];

  let libExport = "";
  let definitions = `import type { ComponentConstructorOptions, SvelteComponent } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";

export type CarbonIconProps = SvelteHTMLElements["svg"] & {
  /**
   * Specify the icon title.
   * @default undefined
   */
  title?: string;

  /**
   * Specify the icon size.
   * @default 16
   */
  size?: 16 | 20 | 24 | 32 | (number & {});

  /**
   * Svelte 3's \`svelte/elements\` doesn't allow \`data-*\` attributes;
   * Svelte 4 and 5 already do.
   */
  [key: \`data-\${string}\`]: any;
}

/**
 * Svelte 5 components are functions and Svelte 4 components are classes.
 * Svelte 4 doesn't export the \`Component\` type, so detect Svelte 5 by
 * \`mount\` (a Svelte 5 export) and spell out each shape with types that
 * both versions export.
 */
type CarbonIcon = typeof import("svelte") extends { mount: any }
  ? (this: void, internals: unknown, props: CarbonIconProps) => {}
  : new (
      options: ComponentConstructorOptions<CarbonIconProps>
    ) => SvelteComponent<CarbonIconProps, Record<string, any>, {}>;\n\n`;

  type Size = "glyph" | "icon";

  interface BySize {
    order: Size[];
    sizes: Record<Size, string[]>;
  }

  const byModuleName: Record<string, string> = {};

  const bySize: BySize = {
    order: ["glyph", "icon"],
    sizes: {
      glyph: [],
      icon: [],
    },
  };

  // Search terms from Carbon's metadata, like "heart" for Favorite, minus
  // any that only repeat the icon's name.
  const aliases: Record<string, string[]> = {};

  let names = new Set<string>();
  let glyphNames = new Set<string>();
  let iconNames = new Set<string>();
  const libFiles = new Map<string, string>();

  iconModuleNames.forEach((moduleName) => {
    let name = moduleName;

    const icon = iconMap.get(name)!;
    const iconMetadata = iconMetadataMap.get(icon.descriptor.name);
    const isGlyph = iconMetadata?.output.some((output) => output.moduleName.endsWith("Glyph")) ?? false;

    if (isGlyph && GLYPH_SUFFIX_PATTERN.test(name)) {
      name = moduleName.replace(GLYPH_SUFFIX_PATTERN, "");
    }

    // Add to category arrays only once per name.
    if (isGlyph && !glyphNames.has(name)) {
      bySize.sizes.glyph.push(name);
      glyphNames.add(name);
    } else if (!isGlyph && !iconNames.has(name)) {
      bySize.sizes.icon.push(name);
      iconNames.add(name);
    }

    if (names.has(name)) return;
    names.add(name);

    const terms = [
      ...new Set((iconMetadata?.aliases ?? []).map((alias) => alias.trim().toLowerCase())),
    ].filter((term) => term && term.replace(/\s+/g, "") !== name.toLowerCase());
    if (terms.length > 0) aliases[name] = terms;

    const inner = renderContent(icon.descriptor);

    byModuleName[name] = templateSvg(icon, inner);
    libExport += `export { default as ${name} } from "./${name}.svelte";\n`;
    definitions += `export declare const ${name}: CarbonIcon;\n`;

    libFiles.set(`${name}.svelte`, template(icon, inner));
  });

  Object.entries(RENAMED_ICONS).forEach(([oldName, newName]) => {
    if (!byModuleName[newName]) {
      throw new Error(`Rename alias target missing: ${newName} for ${oldName}`);
    }

    definitions += `export declare const ${oldName}: CarbonIcon;\n`;

    if (collidesOnCaseInsensitiveFs(oldName, newName)) {
      libExport += `export { default as ${oldName} } from "./${newName}.svelte";\n`;
      return;
    }

    libExport += `export { default as ${oldName} } from "./${oldName}.svelte";\n`;

    libFiles.set(`${oldName}.svelte`, templateAlias(newName));
  });

  libFiles.set("index.js", libExport);

  // Every icon has the same type, so the \`./lib/*.svelte\` export points at
  // one declaration instead of a \`.svelte.d.ts\` stub per icon. It borrows
  // the type of one barrel export so the two can't drift apart.
  libFiles.set(
    "icon.d.ts",
    `import type { Add } from "./index.js";

declare const Icon: typeof Add;
export default Icon;
`
  );

  const version = `[@carbon/icons@${VERSION}](https://unpkg.com/browse/@carbon/icons@${VERSION}/)`;
  // Canonical icons shown in the grid/docs; excludes rename aliases (listed separately).
  const total = new Set(Object.values(bySize.sizes).flat()).size;
  const packageMetadata = `${total} icons from @carbon/icons@${pkg.devDependencies["@carbon/icons"]}`;

  libFiles.set(
    "index.d.ts",
    `// Type definitions for ${pkg.name}
// ${packageMetadata}

${definitions}`
  );

  await syncDir("lib", libFiles, ["animated"]);
  const animatedFiles = await buildAnimated((name) => iconMap.get(name));
  await syncDir("lib/animated", animatedFiles);

  // The animated gallery searches the same terms. Only its icons' terms
  // ship with it, rather than the whole build info.
  const animatedAliases = Object.fromEntries(
    [...animatedFiles.keys()]
      .filter((file) => file.endsWith(".svelte"))
      .map((file) => file.slice(0, -".svelte".length))
      .filter((name) => aliases[name])
      .map((name) => [name, aliases[name]])
  );

  await Bun.write(
    "ICON_INDEX.md",
    `# Icon Index\n
> ${total} icons from ${version}\n
${Object.keys(byModuleName)
      .sort()
      .map(formatIconIndexLine)
      .join("\n")}\n`
  );

  const buildInfoPayload: Record<string, unknown> = {
    total,
    bySize,
    byModuleName,
  };

  if (Object.keys(RENAMED_ICONS).length > 0) {
    buildInfoPayload.renamedIcons = RENAMED_ICONS;
  }
  const buildInfoContent = JSON.stringify(buildInfoPayload);
  const buildInfoHash = createHash("sha256")
    .update(buildInfoContent)
    .digest("hex")
    .slice(0, 12);
  const buildInfoFileName = `build-info.${buildInfoHash}.json`;

  // Search terms are a separate file, so the icons render without waiting
  // for them.
  const aliasesContent = JSON.stringify(aliases);
  const aliasesHash = createHash("sha256").update(aliasesContent).digest("hex").slice(0, 12);
  const aliasesFileName = `aliases.${aliasesHash}.json`;
  const docsPublicDir = "docs/public";

  for (const file of await readdir(docsPublicDir)) {
    if (
      file === "build-info.json" ||
      ((file.startsWith("build-info.") || file.startsWith("aliases.")) && file.endsWith(".json"))
    ) {
      await unlink(`${docsPublicDir}/${file}`);
    }
  }

  await Bun.write(`${docsPublicDir}/${buildInfoFileName}`, buildInfoContent);
  await Bun.write(`${docsPublicDir}/${aliasesFileName}`, aliasesContent);
  await Bun.write(
    "docs/src/generated/build-info-url.ts",
    `// @generated
// This file was automatically generated and should not be edited.
// @see src/index.ts

export const BUILD_INFO_URL = "/${buildInfoFileName}";
export const ALIASES_URL = "/${aliasesFileName}";
`
  );
  await Bun.write(
    "docs/src/generated/animated-aliases.ts",
    `// @generated
// This file was automatically generated and should not be edited.
// @see src/index.ts

export const ANIMATED_ALIASES: Record<string, string[]> = ${JSON.stringify(animatedAliases)};
`
  );

  console.timeEnd("buildIcons");

  const aliasNames = Object.keys(RENAMED_ICONS);

  return [...iconModuleNames, ...aliasNames].sort();
};
