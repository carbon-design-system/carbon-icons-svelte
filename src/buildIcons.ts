import { ensureDir, existsSync, readFile, remove, writeFile } from 'fs-extra';
import { template } from './template';

type IconSize = 16 | 20 | 24 | 32;

interface IPath {
  elem: 'path';
  attrs: { d: string };
}

interface ICircle {
  elem: 'circle';
  attrs: { cx: string; cy: string; r: string };
}

interface IRect {
  elem: 'rect';
  attrs: { width: string; height: string; x: string; y: string; rx: string };
}

export type IconContent = ReadonlyArray<IPath | ICircle | IRect>;

export interface IIconAttrs {
  xmlns: 'http://www.w3.org/2000/svg';
  viewBox: string;
  width: IconSize;
  height: IconSize;
}

export interface IBuildIcon {
  filename: string;
  basename: string;
  size: IconSize;
  prefix: string[];
  descriptor: {
    elem: 'svg';
    attrs: IIconAttrs;
    content: IconContent;
    name: string;
    size: IconSize;
  };
  moduleName: string;
  original: 32;
  outputOptions: {
    file: string;
  };
}

async function buildIcons({ path, dist }: { path: string; dist: string }) {
  if (!existsSync(path)) {
    throw Error(`${path} does not exist.`);
  }

  const buffer = await readFile(path);
  const metadata: IBuildIcon[] = JSON.parse(buffer.toString());

  await remove(dist);
  await ensureDir(dist);

  const baseImports: string[] = [];
  const baseExports: string[] = [];
  const iconIndex: string[] = ['# Icon Index\n\n', '> List of supported icons (moduleName)\n\n'];

  metadata.forEach(async ({ descriptor: { attrs, content }, moduleName }) => {
    const component = template({ attrs, content });
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
