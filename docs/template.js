const fs = require("fs");
const posthtml = require("posthtml");
const { insertAt } = require("posthtml-insert-at");
const icons = require("@carbon/icons");
const {
  formatAttributes,
  getAttributes,
  toString,
} = require("@carbon/icon-helpers");

const attributes = getAttributes();

let bySize = {
  "16": "",
  "20": "",
  "24": "",
  "32": "",
};

let glyphs = "";

Object.keys(icons).forEach((iconKey) => {
  const icon = icons[iconKey];

  if (icon.size in bySize) {
    bySize[icon.size] += `<svg data-module-name="${iconKey}" ${formatAttributes(
      icon.attrs
    )} preserveAspectRatio="${
      attributes.preserveAspectRatio
    }">${icon.content.map((element) => toString(element)).join("")}</svg>`;
  } else {
    glyphs += `<svg data-module-name="${iconKey}" ${formatAttributes(
      icon.attrs
    )} preserveAspectRatio="${
      attributes.preserveAspectRatio
    }">${icon.content.map((element) => toString(element)).join("")}</svg>`;
  }
});

const content = Object.keys(bySize)
  .map((size) => {
    return `
  <div class="row">
    <div class="size"><h4>${size}px</h4></div>
    <div>${bySize[size]}</div>
  </div>
  `;
  })
  .join("");

async function build() {
  const result = await posthtml().use(
    insertAt({
      selector: ".bx--grid",
      append: `
      <div class="row">
        <div class="size"><h4>Glyphs</h4></div>
        <div>${glyphs}</div>
      </div>
      ${content}`,
    })
  ).process(`<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <title>carbon-icons-svelte</title>
      <link rel="stylesheet" href="https://unpkg.com/carbon-components/css/carbon-components.min.css" />
      <style>
        svg[data-module-name] {
          margin: .75rem;
          cursor: pointer;
        }

        .row {
          margin-top: 1rem;
          margin-bottom: 2.5rem;
        }
      
        .size {
          border-bottom: 1px solid #e0e0e0;
        }

        h4 {
          margin-bottom: 1rem;
        }
      </style>
      <script>
        var VERSION = "<%= VERSION %>";
        var ICONS = <%= ICONS %>;
      </script>
    </head>
    <body>
      <div id="app"></div>
      <div class="bx--grid"></div>
    </body>
  </html>`);

  fs.writeFileSync("./public/index.html", result.html);
}

module.exports = { build };
