import type { IconOutput, ModuleName } from "@carbon/icons";
import metadata_11_31 from "@carbon/icons-11.31/metadata.json" assert { type: "json" };
import metadata_latest from "@carbon/icons/metadata.json" assert { type: "json" };
import { $ } from "bun";
import { devDependencies, name } from "../package.json" assert { type: "json" };
import { template, templateSvg } from "./template";

const VERSION = devDependencies["@carbon/icons"];

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
  const iconModuleNames = metadata.icons
    .map((icon) =>
      icon.output.map((icon) => {
        let moduleName = icon.moduleName;

        if (/(16|20|24|32)/.test(moduleName.slice(-2))) {
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

  iconModuleNames.forEach((moduleName) => {
    let name = moduleName;

    const icon = iconMap.get(name)!;

    if (/Glyph$/.test(name)) {
      name = moduleName.replace(/Glyph$/, "");
      bySize.sizes.glyph.push(name);
    } else {
      bySize.sizes.icon.push(name);
    }

    if (names.has(name)) return;
    names.add(name);

    byModuleName[name] = templateSvg(icon);
    libExport += `export { default as ${name} } from "./${name}.svelte";\n`;
    definitions += `export declare class ${name} extends CarbonIcon {}\n`;

    const fileName = `lib/${name}.svelte`;

    Bun.write(fileName, template(icon));
    Bun.write(fileName + ".d.ts", `export { ${name} as default } from "./";\n`);
  });

  await Bun.write("lib/index.js", libExport);

  const version = `[@carbon/icons@${VERSION}](https://unpkg.com/browse/@carbon/icons@${VERSION}/)`;
  const total = iconModuleNames.length;
  const packageMetadata = `${total} icons from @carbon/icons@${devDependencies["@carbon/icons"]}`;

  await Bun.write(
    "lib/index.d.ts",
    `// Type definitions for ${name}
// ${packageMetadata}

${definitions}`
  );

  await Bun.write(
    "ICON_INDEX.md",
    `# Icon Index\n
> ${total} icons from ${version}\n
${iconModuleNames
  .map((moduleName) => `- ${moduleName.replace(/^\_/, "\\_")}`)
  .join("\n")}\n`
  );

  await Bun.write(
    "docs/src/build-info.json",
    JSON.stringify({
      total,
      bySize,
      byModuleName,
      iconModuleNames,
    })
  );

  console.timeEnd("buildIcons");

  return iconModuleNames;
};
