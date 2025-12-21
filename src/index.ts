import type { IconOutput, ModuleName } from "@carbon/icons";
import metadata_11_31 from "@carbon/icons-11.31/metadata.json" with { type: "json" };
import metadata_latest from "@carbon/icons/metadata.json" with { type: "json" };
import { $ } from "bun";
import pkg from "../package.json" with { type: "json" };
import { template, templateSvg } from "./template.js";

const VERSION = pkg.devDependencies["@carbon/icons"];

/**
 * This library is built using the `@carbon/icons` package.
 * However, `@carbon/icons` may remove icons between minor versions.
 * This library has a different contract; icons are not removed
 * in minor versions. To ensure that icons are not removed, we
 * maintain a list of deprecated icons that are merged in.
 */
const DEPRECATED_ICONS = new Set([
  // From 11.31.x
  "FoundationModel",
  "Infinity",
]);

const SIZE_PATTERN = /(16|20|24|32)/;
const GLYPH_SUFFIX_PATTERN = /Glyph$/;
const LEADING_UNDERSCORE_PATTERN = /^\_/;

const metadata = { ...metadata_latest };

// Merge in deprecated icons
metadata_11_31.icons.forEach((icon) => {
  icon.output.forEach((output) => {
    const iconName = output.moduleName.slice(0, -2);

    if (DEPRECATED_ICONS.has(iconName)) {
      metadata.icons.push(icon);
    }
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
  size?: 16 | 20 | 24 | 32;

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

    Bun.write(fileName, template(icon));
    Bun.write(fileName + ".d.ts", `export { ${name} as default } from "./";\n`);
  });

  await Bun.write("lib/index.js", libExport);

  const version = `[@carbon/icons@${VERSION}](https://unpkg.com/browse/@carbon/icons@${VERSION}/)`;
  // Use byModuleName keys for total - these are the actual icon components that exist
  // displayNames includes Glyph variants for searchability, but those aren't separate components
  const total = Object.keys(byModuleName).length;
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
      .map((moduleName) => `- ${moduleName.replace(LEADING_UNDERSCORE_PATTERN, "\\_")}`)
      .join("\n")}\n`
  );

  await Bun.write(
    "docs/src/build-info.json",
    JSON.stringify({
      total,
      bySize,
      byModuleName,
      iconModuleNames: displayNames,
    })
  );

  console.timeEnd("buildIcons");

  return iconModuleNames;
};
