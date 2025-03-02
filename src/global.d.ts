declare module "@carbon/icons" {
  import type { toString } from "@carbon/icon-helpers";

  export type ModuleName = string;

  export interface IconOutput {
    moduleName: ModuleName;
    filepath: string;
    descriptor: {
      elem: "svg";
      attrs: {
        xmlns: "http://www.w3.org/2000/svg";
        viewBox: "0 0 32 32";
        fill: "currentColor";
        width: number;
        height: number;
      };
      content: Parameters<typeof toString>[0][];
      name: string;
      size: number;
    };
    size: number;
  }

  export interface BuildIcons {
    icons: Array<{
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
  }
}

declare module "@carbon/icons/metadata.json" {
  import type { BuildIcons } from "@carbon/icons";
  const value: BuildIcons;
  export default value;
}

declare module "@carbon/icons-11.31/metadata.json" {
  import type { BuildIcons } from "@carbon/icons";
  const value: BuildIcons;
  export default value;
}
