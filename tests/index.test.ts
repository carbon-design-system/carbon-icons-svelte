import type { IconOutput } from "@carbon/icons";
import { expect, test } from "bun:test";
import { buildIcons } from "../src";
import { template } from "../src/template";

test("imports", async () => {
  const icons = await buildIcons();
  expect(icons.length).toEqual(2441);
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

  expect(template(icon)).toMatchSnapshot();
});
