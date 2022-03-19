import BuildIcons, { IconOutput, ModuleName } from "@carbon/icons";
import * as fs from "fs";
import { promisify } from "util";
import { template, templateSvg } from "./template";
import { performance } from "perf_hooks";
import { name, version as PKG_VERSION, devDependencies } from "../package.json";

const VERSION = devDependencies["@carbon/icons"];

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const rm = promisify(fs.rm);
const mkdir = promisify(fs.mkdir);

(async () => {
  const start = performance.now();
  const source = await readFile(
    "node_modules/@carbon/icons/metadata.json",
    "utf8"
  );
  const metadata: BuildIcons = JSON.parse(source);
  const iconMap = new Map<ModuleName, IconOutput>();
  const iconModuleNames = metadata.icons
    .map((icon) =>
      icon.output.map((icon) => {
        iconMap.set(icon.moduleName, icon);
        return icon.moduleName;
      })
    )
    .flat()
    .sort();

  if (fs.existsSync("lib")) {
    await rm("lib", { recursive: true });
  }

  await mkdir("lib");

  let libExport = "";
  let definitions = `import { SvelteComponentTyped } from "svelte";

export interface CarbonIconProps {
  /**
   * Specify an id.
   * @default undefined
   */
  id?: string;

  /**
   * Specify a class.
   * @default undefined
   */
  class?: string;

  /**
   * Set to "0" for the icon to be focusable.
   * @default undefined
   */
  tabindex?: string;

  /**
   * Set to \`true\` for the icon to be focusable.
   * @default false
   */
  focusable?: boolean;

  /**
   * Set a title for the icon.
   * @default undefined
   */
  title?: string;

  /**
   * Set a style for the icon.
   * @default undefined
   */
  style?: string;
}

export interface CarbonIconEvents {
  click: WindowEventMap["click"];
  mouseover: WindowEventMap["mouseover"];
  mouseenter: WindowEventMap["mouseenter"];
  mouseleave: WindowEventMap["mouseleave"];
  keyup: WindowEventMap["keyup"];
  keydown: WindowEventMap["keydown"];
}

export declare class CarbonIcon extends SvelteComponentTyped<
  CarbonIconProps,
  CarbonIconEvents,
  { default: {}; }
> {}\n\n`;

  type Size = "glyph" | "16" | "20" | "24" | "32";

  interface BySize {
    order: Size[];
    sizes: Record<Size, string[]>;
  }

  const byModuleName: Record<string, string> = {};

  const bySize: BySize = {
    order: ["glyph", "16", "20", "24", "32"],
    sizes: {
      glyph: [],
      "16": [],
      "20": [],
      "24": [],
      "32": [],
    },
  };

  iconModuleNames.forEach(async (moduleName) => {
    const icon = iconMap.get(moduleName);

    if (icon) {
      const size = icon.size.toString() as Size;

      bySize.sizes[size].push(moduleName);
      byModuleName[moduleName] = templateSvg(icon);

      libExport += `export { default as ${moduleName} } from "./${moduleName}";\n`;
      definitions += `export declare class ${moduleName} extends CarbonIcon {}\n`;

      await mkdir(`lib/${moduleName}`);
      await writeFile(`lib/${moduleName}/${moduleName}.svelte`, template(icon));
      await writeFile(
        `lib/${moduleName}/index.js`,
        `import ${moduleName} from "./${moduleName}.svelte";\nexport default ${moduleName};`
      );
      await writeFile(
        `lib/${moduleName}/index.d.ts`,
        `export { ${moduleName} as default } from "../";\n`
      );
      await writeFile(
        `lib/${moduleName}/${moduleName}.svelte.d.ts`,
        `export { ${moduleName} as default } from "../";\n`
      );
    }
  });

  await writeFile("lib/index.js", libExport);

  const version = `[@carbon/icons@${VERSION}](https://unpkg.com/browse/@carbon/icons@${VERSION}/)`;
  const total = iconModuleNames.length;
  const packageMetadata = `${total} icons from @carbon/icons@${devDependencies["@carbon/icons"]}`;

  await writeFile(
    "lib/index.d.ts",
    `// Type definitions for ${name}
// ${packageMetadata}

${definitions}`
  );
  await writeFile(
    "ICON_INDEX.md",
    `# Icon Index\n
> ${total} icons from ${version}\n
${iconModuleNames.map((moduleName) => `- ${moduleName}`).join("\n")}\n`
  );

  const bench = (performance.now() - start) / 1000;
  console.log(`Built ${total} icons in ${bench.toFixed(2)}s.`);

  await writeFile(
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
