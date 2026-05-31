import type { IconOutput, ModuleName } from "@carbon/icons";
import metadata_11_31 from "@carbon/icons-11.31/metadata.json" with { type: "json" };
import metadata_latest from "@carbon/icons/metadata.json" with { type: "json" };
import { $ } from "bun";
import pkg from "../package.json" with { type: "json" };
import { template, templateSvg } from "./template.js";

const VERSION = pkg.devDependencies["@carbon/icons"];

type MetadataSource = typeof metadata_latest | typeof metadata_11_31;
type IconEntry = (typeof metadata_latest.icons)[number];

/**
 * This library is built using the `@carbon/icons` package.
 * However, `@carbon/icons` may remove icons between minor versions.
 * This library has a different contract; icons are not removed
 * in minor versions. To ensure that icons are not removed, we
 * maintain a list of deprecated icons that are merged in.
 */
const DEPRECATED_ICONS: Record<string, MetadataSource> = {
  // From 11.31.x
  FoundationModel: metadata_11_31,
  Infinity: metadata_11_31,
};

/**
 * Similarly, `@carbon/icons` may rename icons between minor versions.
 * Maintain a list of renamed icons that are merged in and a mapping of
 * the old export name to the new export name.
 */
const RENAMED_ICONS: Record<string, string> = {};

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
  const aliasTarget = RENAMED_ICONS[moduleName];

  if (aliasTarget) {
    return `- ${escaped} (alias of ${aliasTarget})`;
  }

  return `- ${escaped}`;
};

const metadata = { ...metadata_latest };

// Merge in deprecated icons
Object.entries(DEPRECATED_ICONS).forEach(([iconName, sourceMetadata]) => {
  sourceMetadata.icons.forEach((icon) => {
    icon.output.forEach((output) => {
      const moduleName = output.moduleName.slice(0, -2);

      if (moduleName === iconName) {
        metadata.icons.push(icon as IconEntry);
      }
    });
  });
});

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

  await $`rm -rf lib`;
  await $`mkdir lib`;

  let libExport = "";
  let definitions = `import type { SvelteComponentTyped } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";

type RestProps = SvelteHTMLElements["svg"];

export interface CarbonIconProps extends RestProps {
  /**
   * Specify the icon size.
   * @default 16
   */
  size?: 16 | 20 | 24 | 32 | (number & {});

  /**
   * Specify the icon title.
   * @default undefined
   */
  title?: string;

  [key: \`data-\${string}\`]: any;
}

export declare class CarbonIcon extends SvelteComponentTyped<
  CarbonIconProps,
  Record<string, any>,
  {}
> {}\n\n`;

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

  let names = new Set();
  let glyphNames = new Set<string>();
  let iconNames = new Set<string>();
  const displayNames: string[] = [];
  const writePromises: Promise<number>[] = [];

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
    displayNames.push(name);

    // For glyphs, also add name with "Glyph" suffix for searchability
    if (isGlyph) {
      displayNames.push(name + "Glyph");
    }

    byModuleName[name] = templateSvg(icon);
    libExport += `export { default as ${name} } from "./${name}.svelte";\n`;
    definitions += `export declare class ${name} extends CarbonIcon {}\n`;

    const fileName = `lib/${name}.svelte`;

    writePromises.push(Bun.write(fileName, template(icon)));
    writePromises.push(Bun.write(fileName + ".d.ts", `export { ${name} as default } from "./";\n`));
  });

  Object.entries(RENAMED_ICONS).forEach(([oldName, newName]) => {
    if (!byModuleName[newName]) {
      throw new Error(`Rename alias target missing: ${newName} for ${oldName}`);
    }

    displayNames.push(oldName);
    byModuleName[oldName] = byModuleName[newName];
    definitions += `export declare class ${oldName} extends CarbonIcon {}\n`;

    if (collidesOnCaseInsensitiveFs(oldName, newName)) {
      libExport += `export { default as ${oldName} } from "./${newName}.svelte";\n`;
      return;
    }

    libExport += `export { default as ${oldName} } from "./${oldName}.svelte";\n`;

    const fileName = `lib/${oldName}.svelte`;

    writePromises.push(Bun.write(fileName, templateAlias(newName)));
    writePromises.push(Bun.write(fileName + ".d.ts", `export { default } from "./${newName}.svelte";\n`));
  });

  await Promise.all(writePromises);
  await Bun.write("lib/index.js", libExport);

  const version = `[@carbon/icons@${VERSION}](https://unpkg.com/browse/@carbon/icons@${VERSION}/)`;
  // Canonical icons shown in the grid/docs; excludes rename aliases (listed separately).
  const total = new Set(Object.values(bySize.sizes).flat()).size;
  const packageMetadata = `${total} icons from @carbon/icons@${pkg.devDependencies["@carbon/icons"]}`;

  await Bun.write(
    "lib/index.d.ts",
    `// Type definitions for ${pkg.name}
// ${packageMetadata}

${definitions}`
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

  await Bun.write(
    "docs/src/build-info.json",
    JSON.stringify({
      total,
      bySize,
      byModuleName,
      iconModuleNames: displayNames,
      renamedIcons: RENAMED_ICONS,
    })
  );

  console.timeEnd("buildIcons");

  const aliasNames = Object.keys(RENAMED_ICONS);

  return [...iconModuleNames, ...aliasNames].sort();
};
