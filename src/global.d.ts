declare module "@carbon/icons" {
  import type IconDescriptor from "@carbon/icon-helpers/lib/types";

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
      content: IconDescriptor[];
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
