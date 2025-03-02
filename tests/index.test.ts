import { expect, test } from "bun:test";
import { buildIcons } from "../src/index.js";

test("imports", async () => {
  const icons = await buildIcons();
  expect(icons.length).toEqual(2455);
  expect(icons).toMatchSnapshot();
});
