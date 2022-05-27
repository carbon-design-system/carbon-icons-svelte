import { test, expect } from "vitest";
import * as icons from "../lib";

test("imports", () => {
  expect(Object.keys(icons).length).toEqual(1938);
});
