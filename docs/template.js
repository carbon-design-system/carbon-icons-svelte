const fs = require("fs");
const posthtml = require("posthtml");
const { insertAt } = require("posthtml-insert-at");
const buildInfo = require("./build-info.json");

async function build() {
  try {
    const result = await posthtml().use(
      insertAt({
        selector: ".bx--grid",
        append: ["glyph", "16", "20", "24", "32"]
          .map(
            (size) => `
        <div class="row">
          <div class="size"><h4>${size}${
              size !== "glyph" ? "px" : ""
            }</h4></div>
          <div>${buildInfo.bySize[size].join("")}</div>
        </div>
        `
          )
          .join(""),
      })
    ).process(`<!DOCTYPE html>
  <html lang="en" theme="g100">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="description" content="Carbon Design System icons as Svelte components" />
      <title>carbon-icons-svelte</title>
      <style>
        #svg-root [data-svg-carbon-icon] {
          margin: .5rem;
          cursor: pointer;
        }

        .row {
          margin-top: 1rem;
          margin-bottom: 2.5rem;
        }
      
        .size {
          padding: var(--cds-layout-01) 0;
          margin-bottom: var(--cds-layout-02);
          border-bottom: 1px solid var(--cds-ui-03);
        }

        html[mounted="true"] .skeleton {
          display: none;
        }

        .skeleton {
          position: relative;
          min-height: 12.375rem;
        }

        .skeleton:before {
          position: absolute;
          top: 0;
          left: 0;
          content: '';
          height: 3rem;
          width: 100%;
          border-bottom: 1px solid var(--cds-ui-03);
        }
      </style>
      <script>
        var VERSION = "${buildInfo.VERSION}";
        var ICONS = ${buildInfo.total};
      </script>
    </head>
    <body>
      <div class="skeleton"></div>
      <div id="app"></div>
      <div id="svg-root" class="bx--grid"></div>
    </body>
  </html>`);

    if (!fs.existsSync("./public")) {
      fs.mkdirSync("./public");
    }

    fs.writeFileSync("./public/index.html", result.html);
  } catch (error) {
    console.error(error);
  }
}

module.exports = { build };
