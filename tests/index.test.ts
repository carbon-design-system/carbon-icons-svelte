import type { IconOutput } from "@carbon/icons";
import { describe, expect, test } from "vitest";
import { buildIcons } from "../src";
import { template } from "../src/template";

describe("carbon-icons-svelte", () => {
  test("imports", async () => {
    const icons = await buildIcons();
    expect(icons.length).toMatchInlineSnapshot("2112");
    expect(icons).toMatchSnapshot();
  });

  test("template", () => {
    const icon: IconOutput = {
      moduleName: "Add32",
      filepath: "add/32.js",
      descriptor: {
        elem: "svg",
        attrs: {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 32 32",
          fill: "currentColor",
          width: 32,
          height: 32,
        },
        content: [
          {
            elem: "path",
            attrs: {
              d: "M17 15L17 8 15 8 15 15 8 15 8 17 15 17 15 24 17 24 17 17 24 17 24 15z",
            },
          },
        ],
        name: "add",
        size: 32,
      },
      size: 32,
    };

    expect(template(icon)).toMatchInlineSnapshot(`
    "<script>
      export let size = 16;
    
      export let title = undefined;
    
      \$: labelled = \$\$props[\\"aria-label\\"] || \$\$props[\\"aria-labelledby\\"] || title;
      \$: attributes = {
        \\"aria-hidden\\": labelled ? undefined : true,
        role: labelled ? \\"img\\" : undefined,
        focusable: Number(\$\$props[\\"tabindex\\"]) === 0 ? true : undefined
      };
    </script>
    
    <svg
      xmlns=\\"http://www.w3.org/2000/svg\\"
      viewBox=\\"0 0 32 32\\"
      fill=\\"currentColor\\"
      preserveAspectRatio=\\"xMidYMid meet\\"
      width={size}
      height={size}
      {...attributes}
      {...\$\$restProps}>
      {#if title}<title>{title}</title>{/if}
      <path d=\\"M17 15L17 8 15 8 15 15 8 15 8 17 15 17 15 24 17 24 17 17 24 17 24 15z\\"></path>
    </svg>"
  `);
  });
});
