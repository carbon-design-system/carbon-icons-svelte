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
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <title>carbon-icons-svelte</title>
      <link rel="stylesheet" href="https://unpkg.com/carbon-components@10.19.0/css/carbon-components.min.css" />
      <style>
        #svg-root [data-svg-carbon-icon] {
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
        var VERSION = "${buildInfo.VERSION}";
        var ICONS = ${buildInfo.total};
      </script>
    </head>
    <body>
      <div id="app"></div>
      <div id="svg-root" class="bx--grid"></div>
    </body>
  </html>`);

    fs.writeFileSync("./public/index.html", result.html);
  } catch (error) {
    console.error(error);
  }
}

module.exports = { build };
