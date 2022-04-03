import { test, expect } from "vitest";
import { template } from "../src/template";
import { IconOutput } from "@carbon/icons";

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

test("template", () => {
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
