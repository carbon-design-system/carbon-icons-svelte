import { buildIcons } from "./build";

function build() {
  try {
    buildIcons({
      path: "node_modules/@carbon/icons/build-info.json",
      dist: "lib",
    });
  } catch (error) {
    process.stderr.write(`${error}\n`);
  }
}

build();
