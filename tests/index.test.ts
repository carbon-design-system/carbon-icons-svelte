import { test, expect } from "vitest";
import pkg from "../package.json";

test("Library has 0 dependencies", () => {
  // @ts-expect-error
  expect(Object.keys(pkg.dependencies ?? {}).length).toEqual(0);
});
