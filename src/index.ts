import BuildIcons, { IconOutput, ModuleName } from "@carbon/icons";
import * as fs from "fs";
import { promisify } from "util";
import { template, templateSvg } from "./template";
import { performance } from "perf_hooks";
import { name, devDependencies } from "../package.json";

const VERSION = devDependencies["@carbon/icons"];

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const rmdir = promisify(fs.rmdir);
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

  await rmdir("lib", { recursive: true });
  await mkdir("lib");

  let libExport = "";
  let definitions = `export interface CarbonIconEvents {
  click: MouseEvent,
  mouseover: MouseEvent,
  mouseenter: MouseEvent,
  mouseleave: MouseEvent,
  keyup: KeyboardEvent,
  keydown: KeyboardEvent
}

export declare class CarbonIcon {
  $$prop_def: {
    /** @type {string} [id] */
    id?: string;

    /** @type {string} [class] */
    class?: string;

    /** @type {string} [tabindex] */
    tabindex?: string;

    /** @type {boolean} [focusable] */
    focusable?: boolean;

    /** @type {string} [title] */
    title?: string;

    /** @type {string} [style] */
    style?: string;

    /**
     * Fill color
     * @type {string} [fill="#161616"]
     */
    fill?: string;

    /**
     * Stroke color
     * @type {string} [stroke="currentColor"]
     */
    stroke?: string;

    /** @type {string} [width="48"] */
    width?: string;

    /** @type {string} [height="48"] */
    height?: string;
  };

  $$slot_def: {
    /** @type {{}} [default] */
    default?: {};
  };

  $$events_def: CarbonIconEvents;

  /**
   * stub $on method from svelte-shims.d.ts
   * https://github.com/sveltejs/language-tools/blob/master/packages/svelte2tsx/svelte-shims.d.ts#L48
   */
  $on<K extends keyof CarbonIconEvents>(event: K, handler: (e: CarbonIconEvents[K]) => any): void;
}\n\n`;

  const bySize: Record<string, string[]> = {
    glyph: [],
    "16": [],
    "20": [],
    "24": [],
    "32": [],
  };

  iconModuleNames.forEach(async (moduleName) => {
    const icon = iconMap.get(moduleName);

    if (icon) {
      bySize[icon.size.toString()].push(templateSvg(icon));

      libExport += `export { default as ${moduleName} } from "./${moduleName}";\n`;
      definitions += `export { default as ${moduleName} } from "./${moduleName}";\n`;

      await mkdir(`lib/${moduleName}`);
      await writeFile(`lib/${moduleName}/${moduleName}.svelte`, template(icon));
      await writeFile(
        `lib/${moduleName}/index.js`,
        `import ${moduleName} from "./${moduleName}.svelte";\nexport default ${moduleName};`
      );
      await writeFile(
        `lib/${moduleName}/index.d.ts`,
        `import { CarbonIcon } from "../";
  
export default class ${moduleName} extends CarbonIcon {}\n`
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
    "docs/build-info.json",
    JSON.stringify({ VERSION, total, bySize })
  );
})();
