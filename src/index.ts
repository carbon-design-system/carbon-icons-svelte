import { buildIcons } from './buildIcons';

async function build() {
  const path = 'node_modules/@carbon/icons/build-info.json';
  const dist = 'lib';

  try {
    await buildIcons({ path, dist });
  } catch (error) {
    process.stderr.write(`${error}\n`);
  }
}

build();
