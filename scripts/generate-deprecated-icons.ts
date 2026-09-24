import type { IconOutput } from "@carbon/icons";
import metadata_11_31 from "@carbon/icons-11.31/metadata.json" with { type: "json" };
import metadata_11_80 from "@carbon/icons-11.80/metadata.json" with { type: "json" };
import metadata_11_87 from "@carbon/icons-11.87/metadata.json" with { type: "json" };

type MetadataSource =
  | typeof metadata_11_87
  | typeof metadata_11_80
  | typeof metadata_11_31;
type IconEntry = (typeof metadata_11_80.icons)[number];

/**
 * Icons that `@carbon/icons` removed in a later minor version.
 * Add an entry here (pointing at the pinned historical package
 * in devDependencies that still has it), then run this script to
 * regenerate `src/deprecated-icons.json`.
 */
const DEPRECATED_ICONS: Record<string, MetadataSource> = {
  // From 11.31.x
  FoundationModel: metadata_11_31,
  Infinity: metadata_11_31,
  // From 11.80.x
  IbmBluepay: metadata_11_80,
  IbmTenet: metadata_11_80,
  // From 11.87.x
  AiFinancialSustainabilityCheck: metadata_11_87,
};

const extracted: IconEntry[] = [];

Object.entries(DEPRECATED_ICONS).forEach(([iconName, sourceMetadata]) => {
  const icon = sourceMetadata.icons.find((icon) =>
    icon.output.some(
      (output: IconOutput) => output.moduleName.slice(0, -2) === iconName
    )
  );

  if (!icon) {
    throw new Error(`Could not find icon "${iconName}" in the pinned metadata source`);
  }

  extracted.push(icon as IconEntry);
});

await Bun.write(
  "src/deprecated-icons.json",
  JSON.stringify(extracted, null, 2) + "\n"
);

console.log(`Wrote ${extracted.length} icons to src/deprecated-icons.json`);
