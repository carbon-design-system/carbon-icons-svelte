import { describe, expect, test } from "bun:test";
import { indexAliases, normalize, rankAliases, rankName } from "../docs/src/search.js";

describe("docs search", () => {
  const aliases = indexAliases({ Favorite: ["heart", "like"], Add: ["plus sign"] });

  test("ranks name matches before search terms", () => {
    expect(rankName("add", "Add")).toBe(0);
    expect(rankName("add", "AddAlt")).toBe(1);
    expect(rankName("outline", "CheckmarkOutline")).toBe(2);
    expect(rankName("markout", "CheckmarkOutline")).toBe(3);
    expect(rankName("bell", "BatteryFull")).toBe(-1);
    expect(rankAliases("heart", aliases.get("Favorite"))).toBe(4);
    expect(rankAliases("hear", aliases.get("Favorite"))).toBe(5);
  });

  test("matches each word of a term, and ignores short queries", () => {
    expect(rankAliases("sign", aliases.get("Add"))).toBe(4);
    expect(rankAliases("plussign", aliases.get("Add"))).toBe(4);
    expect(rankAliases("he", aliases.get("Favorite"))).toBe(-1);
  });

  test("normalizes case, spaces, hyphens and underscores", () => {
    expect(normalize("In progress")).toBe(normalize("in-progress"));
    expect(normalize("HeatMap_02")).toBe("heatmap02");
  });
});
