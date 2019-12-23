import BuildIcons from '@carbon/icons';
import { ensureDir, existsSync, readFile, remove, writeFile } from 'fs-extra';
import { template } from './template';

async function buildIcons({ path, dist }: { path: string; dist: string }) {
  if (!existsSync(path)) {
    throw Error(`${path} does not exist.`);
  }

  const buffer = await readFile(path);
  const metadata: BuildIcons = JSON.parse(buffer.toString());

  await remove(dist);
  await ensureDir(dist);

  const baseImports: string[] = [];
  const baseExports: string[] = [];
  const iconIndex: string[] = ['# Icon Index\n\n', '> List of supported icons (moduleName)\n\n'];

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

    await ensureDir(componentFolder);
    await writeFile(componentPath, component);
    await writeFile(exportPath, exportFile);
  });

  const baseFile = `${baseImports.join('')}
export {
  ${baseExports.join(',\n  ')}
};`;

  await writeFile(`${dist}/index.js`, baseFile);
  await ensureDir('docs');
  await writeFile(`docs/ICON_INDEX.md`, iconIndex.join(''));
}

export { buildIcons };
