declare module "@carbon/icons" {
  import { IconAttributes, Descriptor, IconSize } from "@carbon/icon-helpers";

  export type ModuleName = string;

  export interface IconOutput {
    moduleName: ModuleName;
    filepath: string;
    descriptor: {
      elem: "svg";
      attrs: IconAttributes;
      content: Descriptor[];
      name: string;
    };
    size: IconSize;
  }

  type BuildIcons = {
    icons: ReadonlyArray<{
      name: string;
      friendlyName: string;
      namespace: [];
      assets: [
        {
          filepath: string;
          source: string;
          optimized: {
            data: string;
            info: {};
            path: string;
          };
        }
      ];
      output: IconOutput[];
      category: string;
    }>;
  };

  export default BuildIcons;
}
