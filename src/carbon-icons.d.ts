declare module "@carbon/icons" {
  import { IconContent, IconSize, IconAttributes } from "@carbon/icon-helpers";

  export interface IBuildIcon {
    filename: string;
    basename: string;
    size: IconSize;
    prefix: string[];
    descriptor: {
      elem: "svg";
      attrs: IconAttributes;
      content: IconContent;
      name: string;
      size: IconSize;
    };
    moduleName: string;
    original: 32;
    outputOptions: {
      file: string;
    };
  }

  type BuildIcons = ReadonlyArray<IBuildIcon>;

  export default BuildIcons;
}
