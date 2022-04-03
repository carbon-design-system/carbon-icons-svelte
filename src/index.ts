import fsp from "fs/promises";
import { performance } from "perf_hooks";
import metadata from "@carbon/icons/metadata.json";
import type { BuildIcons, IconOutput, ModuleName } from "@carbon/icons";
import { template, templateSvg } from "./template";
import { name, version as PKG_VERSION, devDependencies } from "../package.json";

const VERSION = devDependencies["@carbon/icons"];

(async () => {
  const start = performance.now();
  const iconMap = new Map<ModuleName, IconOutput>();
  const iconModuleNames = (metadata as BuildIcons).icons
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

  await fsp.rm("lib", { recursive: true, force: true });
  await fsp.mkdir("lib");

  let libExport = "";
  let definitions = `/// <reference types="svelte" />
import type { SvelteComponentTyped } from "svelte";

export interface CarbonIconProps extends svelte.JSX.SVGAttributes<SVGSVGElement> {
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
}

export declare class CarbonIcon extends SvelteComponentTyped<
  CarbonIconProps,
  {},
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

  iconModuleNames.forEach((moduleName) => {
    let name = moduleName;

    const icon = iconMap.get(name)!;

    if (/Glyph$/.test(name)) {
      name = moduleName.replace(/Glyph$/, "");
      bySize.sizes.glyph.push(name);
    } else {
      bySize.sizes.icon.push(name);
    }

    byModuleName[name] = templateSvg(icon);
    libExport += `export { default as ${name} } from "./${name}.svelte";\n`;
    definitions += `export declare class ${name} extends CarbonIcon {}\n`;

    const fileName = `lib/${name}.svelte`;

    fsp.writeFile(fileName, template(icon));
    fsp.writeFile(
      fileName + ".d.ts",
      `export { ${name} as default } from "./";\n`
    );
  });

  fsp.writeFile("lib/index.js", libExport);

  const version = `[@carbon/icons@${VERSION}](https://unpkg.com/browse/@carbon/icons@${VERSION}/)`;
  const total = iconModuleNames.length;
  const packageMetadata = `${total} icons from @carbon/icons@${devDependencies["@carbon/icons"]}`;

  fsp.writeFile(
    "lib/index.d.ts",
    `// Type definitions for ${name}
// ${packageMetadata}

${definitions}`
  );

  const bench = (performance.now() - start) / 1000;
  console.log(`Built ${total} icons in ${bench.toFixed(2)}s.`);

  fsp.writeFile(
    "ICON_INDEX.md",
    `# Icon Index\n
> ${total} icons from ${version}\n
${iconModuleNames.map((moduleName) => `- ${moduleName}`).join("\n")}\n`
  );

  fsp.writeFile(
    "preview/build-info.json",
    JSON.stringify({
      VERSION: PKG_VERSION,
      total,
      bySize,
      byModuleName,
      iconModuleNames,
    })
  );
})();
