import BuildIcons from "@carbon/icons";
import * as fs from "fs";
import { promisify } from "util";
import { template } from "./template";
import { performance } from "perf_hooks";
import { devDependencies } from "../package.json";

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
  await rmdir("docs", { recursive: true });
  await mkdir("lib");
  await mkdir("docs");

  const baseImports: string[] = [];
  const baseExports: string[] = [];
  const iconIndex: string[] = ["# Icon Index\n\n", ""];

  metadata.forEach(async ({ descriptor: { attrs, content }, moduleName }) => {
    const component = template({ attrs, content, moduleName });
    const componentName = `${moduleName}.svelte`;
    const componentFolder = `lib/${moduleName}`;
    const componentPath = `${componentFolder}/${componentName}`;
    const exportPath = `lib/${moduleName}/index.js`;
    const exportFile = `import ${moduleName} from './${componentName}';\nexport default ${moduleName};`;

    baseImports.push(`import ${moduleName} from './${moduleName}';\n`);
    baseExports.push(moduleName);
    iconIndex.push(`- ${moduleName}\n`);

    await mkdir(componentFolder);
    await writeFile(componentPath, component);
    await writeFile(exportPath, exportFile);
  });

  const baseFile = `${baseImports.join("")}
export {
  ${baseExports.join(",\n  ")}
};`;

  iconIndex[1] = `> ${baseExports.length} icons from @carbon/icons@${devDependencies["@carbon/icons"]}\n\n`;

  await writeFile(`lib/index.js`, baseFile);
  await writeFile("docs/ICON_INDEX.md", iconIndex.join(""));

  const bench = (performance.now() - start) / 1000;
  console.log(`Built ${baseExports.length} icons in ${bench.toFixed(2)}s.`);
})();
