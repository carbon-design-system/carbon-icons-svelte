import BuildIcons from "@carbon/icons";
import * as fs from "fs";
import { promisify } from "util";
import { template } from "./template";
import { performance } from "perf_hooks";
import { devDependencies } from "../package.json";

const VERSION = devDependencies["@carbon/icons"];

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const rmdir = promisify(fs.rmdir);
const mkdir = promisify(fs.mkdir);

(async () => {
  const start = performance.now();
  const source = await readFile(
    "node_modules/@carbon/icons/build-info.json",
    "utf8"
  );
  const metadata: BuildIcons = JSON.parse(source);

  await rmdir("lib", { recursive: true });
  await mkdir("lib");

  let moduleNames = "";

  const libExport = metadata
    .map(({ moduleName }) => {
      moduleNames += `- ${moduleName}\n`;
      return `export { default as ${moduleName} } from "./${moduleName}";`;
    })
    .join("\n");

  metadata.forEach(async ({ descriptor: { attrs, content }, moduleName }) => {
    await mkdir(`lib/${moduleName}`);
    await writeFile(
      `lib/${moduleName}/${moduleName}.svelte`,
      template({ attrs, content, moduleName })
    );
    await writeFile(
      `lib/${moduleName}/index.js`,
      `import ${moduleName} from "./${moduleName}.svelte";\nexport default ${moduleName};`
    );
  });

  await writeFile("lib/index.js", libExport);
  await writeFile(
    "ICON_INDEX.md",
    `# Icon Index\n
> ${metadata.length} icons from [@carbon/icons@${VERSION}](https://unpkg.com/browse/@carbon/icons@${VERSION}/)\n
${moduleNames}`
  );

  const bench = (performance.now() - start) / 1000;
  console.log(`Built ${metadata.length} icons in ${bench.toFixed(2)}s.`);
})();
