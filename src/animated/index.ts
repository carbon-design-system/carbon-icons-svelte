// See "Animated icons" in CONTRIBUTING.md.

import type { IconOutput } from "@carbon/icons";
import { RULES, ruleIcons } from "./rules.js";
import { DURATION, EASING, withLoop, type AnimatedIcon } from "./shared.js";
import AddIcon from "./icons/Add.js";
import AddAltIcon from "./icons/AddAlt.js";
import AddFilledIcon from "./icons/AddFilled.js";
import AnalyticsIcon from "./icons/Analytics.js";
import ArrowsHorizontalIcon from "./icons/ArrowsHorizontal.js";
import ArrowsVerticalIcon from "./icons/ArrowsVertical.js";
import AsleepIcon from "./icons/Asleep.js";
import AsleepFilledIcon from "./icons/AsleepFilled.js";
import AttachmentIcon from "./icons/Attachment.js";
import BluetoothOffIcon from "./icons/BluetoothOff.js";
import BookmarkIcon from "./icons/Bookmark.js";
import BookmarkFilledIcon from "./icons/BookmarkFilled.js";
import CalendarIcon from "./icons/Calendar.js";
import CameraIcon from "./icons/Camera.js";
import ChartBarIcon from "./icons/ChartBar.js";
import ChatIcon from "./icons/Chat.js";
import ChatOffIcon from "./icons/ChatOff.js";
import CheckboxCheckedIcon from "./icons/CheckboxChecked.js";
import CheckboxCheckedFilledIcon from "./icons/CheckboxCheckedFilled.js";
import CheckmarkIcon from "./icons/Checkmark.js";
import CheckmarkFilledIcon from "./icons/CheckmarkFilled.js";
import CheckmarkOutlineIcon from "./icons/CheckmarkOutline.js";
import ChevronRightIcon from "./icons/ChevronRight.js";
import CircleDashIcon from "./icons/CircleDash.js";
import CloseIcon from "./icons/Close.js";
import CloseFilledIcon from "./icons/CloseFilled.js";
import CloseLargeIcon from "./icons/CloseLarge.js";
import CloseOutlineIcon from "./icons/CloseOutline.js";
import CloudDownloadIcon from "./icons/CloudDownload.js";
import CloudUploadIcon from "./icons/CloudUpload.js";
import CodeIcon from "./icons/Code.js";
import CopyIcon from "./icons/Copy.js";
import CopyFileIcon from "./icons/CopyFile.js";
import CopyLinkIcon from "./icons/CopyLink.js";
import CutIcon from "./icons/Cut.js";
import DocumentAddIcon from "./icons/DocumentAdd.js";
import DocumentDownloadIcon from "./icons/DocumentDownload.js";
import DocumentExportIcon from "./icons/DocumentExport.js";
import DownToBottomIcon from "./icons/DownToBottom.js";
import DownloadIcon from "./icons/Download.js";
import DraggableIcon from "./icons/Draggable.js";
import EditIcon from "./icons/Edit.js";
import EditOffIcon from "./icons/EditOff.js";
import EmailIcon from "./icons/Email.js";
import EmailNewIcon from "./icons/EmailNew.js";
import ErrorIcon from "./icons/Error.js";
import ErrorFilledIcon from "./icons/ErrorFilled.js";
import ErrorOutlineIcon from "./icons/ErrorOutline.js";
import FavoriteIcon from "./icons/Favorite.js";
import FavoriteFilledIcon from "./icons/FavoriteFilled.js";
import FireIcon from "./icons/Fire.js";
import FlagIcon from "./icons/Flag.js";
import FlagFilledIcon from "./icons/FlagFilled.js";
import FlashIcon from "./icons/Flash.js";
import FlashFilledIcon from "./icons/FlashFilled.js";
import FlashOffIcon from "./icons/FlashOff.js";
import FlashOffFilledIcon from "./icons/FlashOffFilled.js";
import FolderAddIcon from "./icons/FolderAdd.js";
import GiftIcon from "./icons/Gift.js";
import HelpIcon from "./icons/Help.js";
import HelpFilledIcon from "./icons/HelpFilled.js";
import HourglassIcon from "./icons/Hourglass.js";
import IdeaIcon from "./icons/Idea.js";
import InProgressIcon from "./icons/InProgress.js";
import IncompleteIcon from "./icons/Incomplete.js";
import InformationIcon from "./icons/Information.js";
import InformationFilledIcon from "./icons/InformationFilled.js";
import InformationSquareIcon from "./icons/InformationSquare.js";
import InformationSquareFilledIcon from "./icons/InformationSquareFilled.js";
import LaunchIcon from "./icons/Launch.js";
import LightIcon from "./icons/Light.js";
import LightFilledIcon from "./icons/LightFilled.js";
import LinkIcon from "./icons/Link.js";
import LocationIcon from "./icons/Location.js";
import LocationFilledIcon from "./icons/LocationFilled.js";
import LockedIcon from "./icons/Locked.js";
import LockedFilledIcon from "./icons/LockedFilled.js";
import LoginIcon from "./icons/Login.js";
import LogoutIcon from "./icons/Logout.js";
import MaximizeIcon from "./icons/Maximize.js";
import MenuIcon from "./icons/Menu.js";
import MicrophoneOffIcon from "./icons/MicrophoneOff.js";
import MicrophoneOffFilledIcon from "./icons/MicrophoneOffFilled.js";
import MinimizeIcon from "./icons/Minimize.js";
import MisuseIcon from "./icons/Misuse.js";
import MisuseOutlineIcon from "./icons/MisuseOutline.js";
import NotificationIcon from "./icons/Notification.js";
import NotificationFilledIcon from "./icons/NotificationFilled.js";
import NotificationNewIcon from "./icons/NotificationNew.js";
import NotificationOffIcon from "./icons/NotificationOff.js";
import NotificationOffFilledIcon from "./icons/NotificationOffFilled.js";
import OverflowMenuHorizontalIcon from "./icons/OverflowMenuHorizontal.js";
import OverflowMenuVerticalIcon from "./icons/OverflowMenuVertical.js";
import PauseIcon from "./icons/Pause.js";
import PauseFilledIcon from "./icons/PauseFilled.js";
import PauseOutlineIcon from "./icons/PauseOutline.js";
import PauseOutlineFilledIcon from "./icons/PauseOutlineFilled.js";
import PendingIcon from "./icons/Pending.js";
import PendingFilledIcon from "./icons/PendingFilled.js";
import PhoneIcon from "./icons/Phone.js";
import PhoneFilledIcon from "./icons/PhoneFilled.js";
import PhoneOffIcon from "./icons/PhoneOff.js";
import PhoneOffFilledIcon from "./icons/PhoneOffFilled.js";
import PinIcon from "./icons/Pin.js";
import PinFilledIcon from "./icons/PinFilled.js";
import PlayIcon from "./icons/Play.js";
import PlayFilledIcon from "./icons/PlayFilled.js";
import PlayOutlineIcon from "./icons/PlayOutline.js";
import PlayOutlineFilledIcon from "./icons/PlayOutlineFilled.js";
import PrinterIcon from "./icons/Printer.js";
import RadioButtonCheckedIcon from "./icons/RadioButtonChecked.js";
import RenewIcon from "./icons/Renew.js";
import RocketIcon from "./icons/Rocket.js";
import RotateClockwiseIcon from "./icons/RotateClockwise.js";
import RotateClockwiseAltIcon from "./icons/RotateClockwiseAlt.js";
import RotateClockwiseAltFilledIcon from "./icons/RotateClockwiseAltFilled.js";
import RotateClockwiseFilledIcon from "./icons/RotateClockwiseFilled.js";
import RotateCounterclockwiseIcon from "./icons/RotateCounterclockwise.js";
import RotateCounterclockwiseAltIcon from "./icons/RotateCounterclockwiseAlt.js";
import RotateCounterclockwiseAltFilledIcon from "./icons/RotateCounterclockwiseAltFilled.js";
import RotateCounterclockwiseFilledIcon from "./icons/RotateCounterclockwiseFilled.js";
import SaveIcon from "./icons/Save.js";
import SearchIcon from "./icons/Search.js";
import SendIcon from "./icons/Send.js";
import SendAltIcon from "./icons/SendAlt.js";
import SendAltFilledIcon from "./icons/SendAltFilled.js";
import SendFilledIcon from "./icons/SendFilled.js";
import SettingsIcon from "./icons/Settings.js";
import ShareIcon from "./icons/Share.js";
import ShoppingCartIcon from "./icons/ShoppingCart.js";
import SortAscendingIcon from "./icons/SortAscending.js";
import SortDescendingIcon from "./icons/SortDescending.js";
import StarIcon from "./icons/Star.js";
import StarFilledIcon from "./icons/StarFilled.js";
import StopIcon from "./icons/Stop.js";
import StopFilledIcon from "./icons/StopFilled.js";
import StopOutlineIcon from "./icons/StopOutline.js";
import StopOutlineFilledIcon from "./icons/StopOutlineFilled.js";
import SubtractIcon from "./icons/Subtract.js";
import SubtractAltIcon from "./icons/SubtractAlt.js";
import SubtractFilledIcon from "./icons/SubtractFilled.js";
import SubtractLargeIcon from "./icons/SubtractLarge.js";
import SunIcon from "./icons/Sun.js";
import TagIcon from "./icons/Tag.js";
import TerminalIcon from "./icons/Terminal.js";
import ThumbsDownIcon from "./icons/ThumbsDown.js";
import ThumbsDownFilledIcon from "./icons/ThumbsDownFilled.js";
import ThumbsUpIcon from "./icons/ThumbsUp.js";
import ThumbsUpFilledIcon from "./icons/ThumbsUpFilled.js";
import TimeIcon from "./icons/Time.js";
import TimeFilledIcon from "./icons/TimeFilled.js";
import TrashCanIcon from "./icons/TrashCan.js";
import UnlinkIcon from "./icons/Unlink.js";
import UnlockedIcon from "./icons/Unlocked.js";
import UnlockedFilledIcon from "./icons/UnlockedFilled.js";
import UpToTopIcon from "./icons/UpToTop.js";
import UploadIcon from "./icons/Upload.js";
import UserIcon from "./icons/User.js";
import UserAvatarIcon from "./icons/UserAvatar.js";
import UserAvatarFilledAltIcon from "./icons/UserAvatarFilledAlt.js";
import UserFilledIcon from "./icons/UserFilled.js";
import UserFollowIcon from "./icons/UserFollow.js";
import VideoOffIcon from "./icons/VideoOff.js";
import VideoOffFilledIcon from "./icons/VideoOffFilled.js";
import ViewIcon from "./icons/View.js";
import ViewOffIcon from "./icons/ViewOff.js";
import ViewOffFilledIcon from "./icons/ViewOffFilled.js";
import VolumeDownIcon from "./icons/VolumeDown.js";
import VolumeDownAltIcon from "./icons/VolumeDownAlt.js";
import VolumeDownFilledIcon from "./icons/VolumeDownFilled.js";
import VolumeMuteIcon from "./icons/VolumeMute.js";
import VolumeMuteFilledIcon from "./icons/VolumeMuteFilled.js";
import VolumeUpIcon from "./icons/VolumeUp.js";
import VolumeUpAltIcon from "./icons/VolumeUpAlt.js";
import VolumeUpFilledIcon from "./icons/VolumeUpFilled.js";
import WarningIcon from "./icons/Warning.js";
import WarningAltIcon from "./icons/WarningAlt.js";
import WarningAltFilledIcon from "./icons/WarningAltFilled.js";
import WarningAltInvertedIcon from "./icons/WarningAltInverted.js";
import WarningAltInvertedFilledIcon from "./icons/WarningAltInvertedFilled.js";
import WarningDiamondIcon from "./icons/WarningDiamond.js";
import WarningFilledIcon from "./icons/WarningFilled.js";
import WarningHexIcon from "./icons/WarningHex.js";
import WarningHexFilledIcon from "./icons/WarningHexFilled.js";
import WarningSquareIcon from "./icons/WarningSquare.js";
import WarningSquareFilledIcon from "./icons/WarningSquareFilled.js";
import WifiIcon from "./icons/Wifi.js";
import WifiOffIcon from "./icons/WifiOff.js";
import ZoomInIcon from "./icons/ZoomIn.js";
import ZoomOutIcon from "./icons/ZoomOut.js";
import ZoomResetIcon from "./icons/ZoomReset.js";

export type { AnimatedIcon } from "./shared.js";

// Suffixed so icon names like `Error` don't shadow globals.
export const ANIMATED_ICONS: AnimatedIcon[] = [
  AddIcon,
  AddAltIcon,
  AddFilledIcon,
  AnalyticsIcon,
  ArrowsHorizontalIcon,
  ArrowsVerticalIcon,
  AsleepIcon,
  AsleepFilledIcon,
  AttachmentIcon,
  BluetoothOffIcon,
  BookmarkIcon,
  BookmarkFilledIcon,
  CalendarIcon,
  CameraIcon,
  ChartBarIcon,
  ChatIcon,
  ChatOffIcon,
  CheckboxCheckedIcon,
  CheckboxCheckedFilledIcon,
  CheckmarkIcon,
  CheckmarkFilledIcon,
  CheckmarkOutlineIcon,
  ChevronRightIcon,
  CircleDashIcon,
  CloseIcon,
  CloseFilledIcon,
  CloseLargeIcon,
  CloseOutlineIcon,
  CloudDownloadIcon,
  CloudUploadIcon,
  CodeIcon,
  CopyIcon,
  CopyFileIcon,
  CopyLinkIcon,
  CutIcon,
  DocumentAddIcon,
  DocumentDownloadIcon,
  DocumentExportIcon,
  DownToBottomIcon,
  DownloadIcon,
  DraggableIcon,
  EditIcon,
  EditOffIcon,
  EmailIcon,
  EmailNewIcon,
  ErrorIcon,
  ErrorFilledIcon,
  ErrorOutlineIcon,
  FavoriteIcon,
  FavoriteFilledIcon,
  FireIcon,
  FlagIcon,
  FlagFilledIcon,
  FlashIcon,
  FlashFilledIcon,
  FlashOffIcon,
  FlashOffFilledIcon,
  FolderAddIcon,
  GiftIcon,
  HelpIcon,
  HelpFilledIcon,
  HourglassIcon,
  IdeaIcon,
  InProgressIcon,
  IncompleteIcon,
  InformationIcon,
  InformationFilledIcon,
  InformationSquareIcon,
  InformationSquareFilledIcon,
  LaunchIcon,
  LightIcon,
  LightFilledIcon,
  LinkIcon,
  LocationIcon,
  LocationFilledIcon,
  LockedIcon,
  LockedFilledIcon,
  LoginIcon,
  LogoutIcon,
  MaximizeIcon,
  MenuIcon,
  MicrophoneOffIcon,
  MicrophoneOffFilledIcon,
  MinimizeIcon,
  MisuseIcon,
  MisuseOutlineIcon,
  NotificationIcon,
  NotificationFilledIcon,
  NotificationNewIcon,
  NotificationOffIcon,
  NotificationOffFilledIcon,
  OverflowMenuHorizontalIcon,
  OverflowMenuVerticalIcon,
  PauseIcon,
  PauseFilledIcon,
  PauseOutlineIcon,
  PauseOutlineFilledIcon,
  PendingIcon,
  PendingFilledIcon,
  PhoneIcon,
  PhoneFilledIcon,
  PhoneOffIcon,
  PhoneOffFilledIcon,
  PinIcon,
  PinFilledIcon,
  PlayIcon,
  PlayFilledIcon,
  PlayOutlineIcon,
  PlayOutlineFilledIcon,
  PrinterIcon,
  RadioButtonCheckedIcon,
  RenewIcon,
  RocketIcon,
  RotateClockwiseIcon,
  RotateClockwiseAltIcon,
  RotateClockwiseAltFilledIcon,
  RotateClockwiseFilledIcon,
  RotateCounterclockwiseIcon,
  RotateCounterclockwiseAltIcon,
  RotateCounterclockwiseAltFilledIcon,
  RotateCounterclockwiseFilledIcon,
  SaveIcon,
  SearchIcon,
  SendIcon,
  SendAltIcon,
  SendAltFilledIcon,
  SendFilledIcon,
  SettingsIcon,
  ShareIcon,
  ShoppingCartIcon,
  SortAscendingIcon,
  SortDescendingIcon,
  StarIcon,
  StarFilledIcon,
  StopIcon,
  StopFilledIcon,
  StopOutlineIcon,
  StopOutlineFilledIcon,
  SubtractIcon,
  SubtractAltIcon,
  SubtractFilledIcon,
  SubtractLargeIcon,
  SunIcon,
  TagIcon,
  TerminalIcon,
  ThumbsDownIcon,
  ThumbsDownFilledIcon,
  ThumbsUpIcon,
  ThumbsUpFilledIcon,
  TimeIcon,
  TimeFilledIcon,
  TrashCanIcon,
  UnlinkIcon,
  UnlockedIcon,
  UnlockedFilledIcon,
  UpToTopIcon,
  UploadIcon,
  UserIcon,
  UserAvatarIcon,
  UserAvatarFilledAltIcon,
  UserFilledIcon,
  UserFollowIcon,
  VideoOffIcon,
  VideoOffFilledIcon,
  ViewIcon,
  ViewOffIcon,
  ViewOffFilledIcon,
  VolumeDownIcon,
  VolumeDownAltIcon,
  VolumeDownFilledIcon,
  VolumeMuteIcon,
  VolumeMuteFilledIcon,
  VolumeUpIcon,
  VolumeUpAltIcon,
  VolumeUpFilledIcon,
  WarningIcon,
  WarningAltIcon,
  WarningAltFilledIcon,
  WarningAltInvertedIcon,
  WarningAltInvertedFilledIcon,
  WarningDiamondIcon,
  WarningFilledIcon,
  WarningHexIcon,
  WarningHexFilledIcon,
  WarningSquareIcon,
  WarningSquareFilledIcon,
  WifiIcon,
  WifiOffIcon,
  ZoomInIcon,
  ZoomOutIcon,
  ZoomResetIcon,
];

/** Content that references `{id}` gets a unique id prefix per instance. */
const ID_PATTERN = /\{id\}/;

export const HOVER_DELAY = parseInt(DURATION.moderate01);

export const fillTokens = (source: string) =>
  source
    .replace("__DURATION_MODERATE_01__", String(HOVER_DELAY))
    .replace("__DURATION_SLOW_01__", String(parseInt(DURATION.slow01)))
    .replace("__DURATION_SLOW_02__", String(parseInt(DURATION.slow02)))
    .replace("__EASING_STANDARD_PRODUCTIVE__", JSON.stringify(EASING.standard.productive))
    .replace("__EASING_STANDARD_EXPRESSIVE__", JSON.stringify(EASING.standard.expressive));

export const templateAnimated = ({ content, css, loop }: AnimatedIcon) => {
  const usesId = ID_PATTERN.test(content);

  return `<script>
  import { animate, getAnimatedIconDefaults${usesId ? ", uid" : ""} } from "./animate.js";

  export let size = 16;

  export let title = undefined;

  export let play = false;

  export let loop = false;

  export let trigger = undefined;

  export let motion = undefined;

  export let reducedMotion = undefined;

  export let hoverDelay = undefined;

  const defaults = getAnimatedIconDefaults();
${usesId ? "\n  const id = uid();\n" : ""}
  $: labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title;
  $: attributes = {
    "aria-hidden": labelled ? undefined : true,
    role: labelled ? "img" : undefined,
    focusable: Number($$props["tabindex"]) === 0 ? true : undefined
  };
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 32 32"
  fill="currentColor"
  preserveAspectRatio="xMidYMid meet"
  width={size}
  height={size}
  data-motion={motion ?? defaults.motion ?? "productive"}
  use:animate={{ play, loop, loops: ${loop ? "true" : "false"}, trigger, reducedMotion, hoverDelay, defaults }}
  {...attributes}
  {...$$restProps}>
  {#if title}<title>{title}</title>{/if}
  ${content}
</svg>

<style>
${loop ? withLoop(css) : css}
</style>
`;
};

const definitions = (names: string[]) => `import type { ComponentConstructorOptions, SvelteComponent } from "svelte";
import type { CarbonIconProps } from "../index.js";

/** Props that \`setAnimatedIconDefaults\` can set for every icon below a component. */
export type CarbonAnimatedIconDefaults = {
  /**
   * \`"hover"\` plays the animation when a mouse rests on the icon, or on the
   * link, button, label or summary around it, for \`hoverDelay\` ms, or when
   * that gets keyboard focus. \`"none"\` plays it only through \`play\`.
   * @default "hover"
   */
  trigger?: "hover" | "none";

  /**
   * Carbon's motion style. \`"productive"\` is short and subtle, for routine UI.
   * \`"expressive"\` is larger and livelier, for moments that matter.
   * @default "productive"
   */
  motion?: "productive" | "expressive";

  /**
   * What plays when the user prefers reduced motion. \`"static"\` plays
   * nothing. \`"fade"\` dims the icon and brings it back, without moving it.
   * \`"full"\` plays the full motion anyway; use it only when the motion is
   * essential to understanding the change.
   * @default "static"
   */
  reducedMotion?: "static" | "fade" | "full";

  /**
   * How long, in ms, a mouse must rest on the trigger before the icon plays,
   * so sweeping across a toolbar plays nothing.
   * @default ${HOVER_DELAY}
   */
  hoverDelay?: number;
};

export type CarbonAnimatedIconProps = CarbonIconProps &
  CarbonAnimatedIconDefaults & {
    /**
     * Plays the animation when the icon mounts with a truthy value, and each
     * time this changes to a new truthy value. Increment a number to replay
     * it on demand.
     * @default false
     */
    play?: boolean | number;

    /**
     * Repeats the animation while \`true\`, for progress. When it turns
     * \`false\`, the current cycle finishes and the icon stops at rest. Only
     * icons with a loop respond: the progress icons (\`CircleDash\`, \`Hourglass\`,
     * \`InProgress\`, \`Incomplete\`, \`Pending\`, \`PendingFilled\`) and the
     * refresh and processing icons (\`Renew\`, \`RenewAlt\`, \`Restart\`,
     * \`Reset\`, \`Repeat\`, \`Recycle\`, \`Settings\`, \`Terminal\`, \`Time\`,
     * \`TimeFilled\`).
     * @default false
     */
    loop?: boolean;
  };

/** See \`CarbonIcon\` in \`../index.d.ts\`. */
type CarbonAnimatedIcon = typeof import("svelte") extends { mount: any }
  ? (this: void, internals: unknown, props: CarbonAnimatedIconProps) => {}
  : new (
      options: ComponentConstructorOptions<CarbonAnimatedIconProps>
    ) => SvelteComponent<CarbonAnimatedIconProps, Record<string, any>, {}>;

/**
 * Sets defaults for every animated icon in this component and its children,
 * such as icons passed to a component's \`icon\` prop, which can't take
 * extra props. Call it while the component initializes. Props on an icon win.
 */
export declare function setAnimatedIconDefaults(defaults: CarbonAnimatedIconDefaults): void;

${names.map((name) => `export declare const ${name}: CarbonAnimatedIcon;`).join("\n")}
`;

export type IconLookup = (name: string) => IconOutput | undefined;

export const allAnimatedIcons = (lookup: IconLookup) => {
  const handBuilt = new Set(ANIMATED_ICONS.map(({ name }) => name));

  for (const name of handBuilt) {
    if (!lookup(name)) throw new Error(`Animated icon has no static icon: ${name}`);
  }

  for (const name of Object.keys(RULES)) {
    if (handBuilt.has(name)) throw new Error(`Animated icon is both hand-built and rule-based: ${name}`);
  }

  return [...ANIMATED_ICONS, ...ruleIcons(lookup)].sort((a, b) => (a.name < b.name ? -1 : 1));
};

export const buildAnimated = async (lookup: IconLookup) => {
  const files = new Map<string, string>();
  const icons = allAnimatedIcons(lookup);
  const names = icons.map(({ name }) => name);

  for (const icon of icons) {
    files.set(`${icon.name}.svelte`, templateAnimated(icon));
  }

  files.set("animate.js", fillTokens(await Bun.file(new URL("./animate.js", import.meta.url)).text()));
  files.set(
    "index.js",
    'export { setAnimatedIconDefaults } from "./animate.js";\n' +
      names.map((name) => `export { default as ${name} } from "./${name}.svelte";\n`).join("")
  );
  files.set("index.d.ts", definitions(names));
  files.set(
    "icon.d.ts",
    `import type { ${names[0]} } from "./index.js";

declare const Icon: typeof ${names[0]};
export default Icon;
`
  );

  return files;
};
