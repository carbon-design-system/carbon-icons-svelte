import * as icons from '@carbon/icons';
import * as fs from 'fs-extra';
import { createComponent } from './createComponent';
import { formatName } from './format';

async function build() {
  await fs.remove('lib');
  await fs.ensureDir('lib');
  await fs.ensureDir('lib/src');

  const baseImports: string[] = [];
  const baseExports: { [componentName: string]: string } = {};

  Object.keys(icons).forEach(async iconName => {
    const { name, size, markup } = createComponent(icons[iconName]);
    const componentName = formatName({ name, size });

    if (componentName != null && !(componentName in baseExports)) {
      baseImports.push(`import ${componentName} from './${componentName}';`);
      baseExports[componentName] = componentName;

      await fs.ensureDir(`lib/${componentName}`);
      await fs.writeFile(
        `lib/${componentName}/index.js`,
        `
        import ${componentName} from './${componentName}.svelte';
        export default ${componentName};
        `
      );
      await fs.writeFile(
        `lib/${componentName}/${componentName}.svelte`,
        markup
      );
    }
  });

  const indexFile = [
    ...baseImports,
    `
      export {
        ${Object.keys(baseExports)
          .map(item => item)
          .join(',')}
      }
    `
  ];

  await fs.writeFile(`lib/index.js`, indexFile.join(''));
}

build();
