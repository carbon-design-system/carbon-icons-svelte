import BuildIcons from "@carbon/icons";
import { readFileSync, rmdirSync, mkdirSync, writeFileSync } from "fs";
import { template } from "./template";

async function buildIcons({ path, dist }: { path: string; dist: string }) {
  const metadata: BuildIcons = JSON.parse(readFileSync(path).toString());

  rmdirSync(dist, { recursive: true });
  mkdirSync(dist);

  const baseImports: string[] = [];
  const baseExports: string[] = [];
  const iconIndex: string[] = [
    "# Icon Index\n\n",
    "> List of supported icons (moduleName)\n\n",
  ];

  metadata.forEach(async ({ descriptor: { attrs, content }, moduleName }) => {
    const component = template({ attrs, content, moduleName });
    const componentName = `${moduleName}.svelte`;
    const componentFolder = `${dist}/${moduleName}`;
    const componentPath = `${componentFolder}/${componentName}`;
    const exportPath = `${dist}/${moduleName}/index.js`;
    const exportFile = `import ${moduleName} from './${componentName}';
export default ${moduleName};`;

    baseImports.push(`import ${moduleName} from './${moduleName}';\n`);
    baseExports.push(moduleName);
    iconIndex.push(`- ${moduleName}\n`);

    mkdirSync(componentFolder);
    writeFileSync(componentPath, component);
    writeFileSync(exportPath, exportFile);
  });

  const baseFile = `${baseImports.join("")}
export {
  ${baseExports.join(",\n  ")}
};`;

  writeFileSync(`${dist}/index.js`, baseFile);
  rmdirSync("docs", { recursive: true });
  mkdirSync("docs");
  writeFileSync("docs/ICON_INDEX.md", iconIndex.join(""));
}

export { buildIcons };
