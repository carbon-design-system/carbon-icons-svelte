// See "Animated icons" in CONTRIBUTING.md.

import type { IconOutput } from "@carbon/icons";
import { RULES, ruleIcons } from "./rules.js";
import { DURATION, EASING, scopeCss, withLoop, type AnimatedIcon } from "./shared.js";
import ActivityIcon from "./icons/Activity.js";
import AddIcon from "./icons/Add.js";
import AddAltIcon from "./icons/AddAlt.js";
import AddFilledIcon from "./icons/AddFilled.js";
import AlarmIcon from "./icons/Alarm.js";
import AnalyticsIcon from "./icons/Analytics.js";
import ArrowsHorizontalIcon from "./icons/ArrowsHorizontal.js";
import ArrowsVerticalIcon from "./icons/ArrowsVertical.js";
import AsleepIcon from "./icons/Asleep.js";
import AsleepFilledIcon from "./icons/AsleepFilled.js";
import AttachmentIcon from "./icons/Attachment.js";
import BatteryChargingIcon from "./icons/BatteryCharging.js";
import BluetoothOffIcon from "./icons/BluetoothOff.js";
import BookmarkIcon from "./icons/Bookmark.js";
import BookmarkAddIcon from "./icons/BookmarkAdd.js";
import BookmarkFilledIcon from "./icons/BookmarkFilled.js";
import BotIcon from "./icons/Bot.js";
import BullhornIcon from "./icons/Bullhorn.js";
import CalendarIcon from "./icons/Calendar.js";
import CameraIcon from "./icons/Camera.js";
import ChartBarIcon from "./icons/ChartBar.js";
import ChatIcon from "./icons/Chat.js";
import ChatOffIcon from "./icons/ChatOff.js";
import CheckboxCheckedIcon from "./icons/CheckboxChecked.js";
import CheckboxCheckedFilledIcon from "./icons/CheckboxCheckedFilled.js";
import CheckmarkIcon from "./icons/Checkmark.js";
import CheckmarkFilledIcon from "./icons/CheckmarkFilled.js";
import CheckmarkFilledErrorIcon from "./icons/CheckmarkFilledError.js";
import CheckmarkFilledWarningIcon from "./icons/CheckmarkFilledWarning.js";
import CheckmarkOutlineIcon from "./icons/CheckmarkOutline.js";
import CheckmarkOutlineErrorIcon from "./icons/CheckmarkOutlineError.js";
import CheckmarkOutlineWarningIcon from "./icons/CheckmarkOutlineWarning.js";
import ChevronRightIcon from "./icons/ChevronRight.js";
import CircleDashIcon from "./icons/CircleDash.js";
import CloseIcon from "./icons/Close.js";
import CloseFilledIcon from "./icons/CloseFilled.js";
import CloseLargeIcon from "./icons/CloseLarge.js";
import CloseOutlineIcon from "./icons/CloseOutline.js";
import CloudDownloadIcon from "./icons/CloudDownload.js";
import CloudOfflineIcon from "./icons/CloudOffline.js";
import CloudUploadIcon from "./icons/CloudUpload.js";
import CodeIcon from "./icons/Code.js";
import CopyIcon from "./icons/Copy.js";
import CopyFileIcon from "./icons/CopyFile.js";
import CopyLinkIcon from "./icons/CopyLink.js";
import Cursor_1Icon from "./icons/Cursor_1.js";
import CutIcon from "./icons/Cut.js";
import DashboardIcon from "./icons/Dashboard.js";
import DocumentAddIcon from "./icons/DocumentAdd.js";
import DocumentDownloadIcon from "./icons/DocumentDownload.js";
import DocumentExportIcon from "./icons/DocumentExport.js";
import DocumentSubtractIcon from "./icons/DocumentSubtract.js";
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
import FavoriteHalfIcon from "./icons/FavoriteHalf.js";
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
import ImageIcon from "./icons/Image.js";
import InProgressIcon from "./icons/InProgress.js";
import InProgressErrorIcon from "./icons/InProgressError.js";
import InProgressWarningIcon from "./icons/InProgressWarning.js";
import IncompleteIcon from "./icons/Incomplete.js";
import IncompleteCancelIcon from "./icons/IncompleteCancel.js";
import IncompleteErrorIcon from "./icons/IncompleteError.js";
import IncompleteWarningIcon from "./icons/IncompleteWarning.js";
import InformationIcon from "./icons/Information.js";
import InformationFilledIcon from "./icons/InformationFilled.js";
import InformationSquareIcon from "./icons/InformationSquare.js";
import InformationSquareFilledIcon from "./icons/InformationSquareFilled.js";
import KeyboardIcon from "./icons/Keyboard.js";
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
import MoonIcon from "./icons/Moon.js";
import NotificationIcon from "./icons/Notification.js";
import NotificationCounterIcon from "./icons/NotificationCounter.js";
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
import PhoneIncomingIcon from "./icons/PhoneIncoming.js";
import PhoneOffIcon from "./icons/PhoneOff.js";
import PhoneOffFilledIcon from "./icons/PhoneOffFilled.js";
import PhoneOutgoingIcon from "./icons/PhoneOutgoing.js";
import PinIcon from "./icons/Pin.js";
import PinFilledIcon from "./icons/PinFilled.js";
import PlayIcon from "./icons/Play.js";
import PlayFilledIcon from "./icons/PlayFilled.js";
import PlayOutlineIcon from "./icons/PlayOutline.js";
import PlayOutlineFilledIcon from "./icons/PlayOutlineFilled.js";
import PlugIcon from "./icons/Plug.js";
import PowerIcon from "./icons/Power.js";
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
import RssIcon from "./icons/Rss.js";
import SaveIcon from "./icons/Save.js";
import SearchIcon from "./icons/Search.js";
import SendIcon from "./icons/Send.js";
import SendAltIcon from "./icons/SendAlt.js";
import SendAltFilledIcon from "./icons/SendAltFilled.js";
import SendFilledIcon from "./icons/SendFilled.js";
import SettingsIcon from "./icons/Settings.js";
import ShareIcon from "./icons/Share.js";
import ShoppingCartIcon from "./icons/ShoppingCart.js";
import ShoppingCartClearIcon from "./icons/ShoppingCartClear.js";
import ShoppingCartMinusIcon from "./icons/ShoppingCartMinus.js";
import ShoppingCartPlusIcon from "./icons/ShoppingCartPlus.js";
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
import ThumbsUpDoubleIcon from "./icons/ThumbsUpDouble.js";
import ThumbsUpFilledIcon from "./icons/ThumbsUpFilled.js";
import TimeIcon from "./icons/Time.js";
import TimeFilledIcon from "./icons/TimeFilled.js";
import TimerIcon from "./icons/Timer.js";
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
  ActivityIcon,
  AddIcon,
  AddAltIcon,
  AddFilledIcon,
  AlarmIcon,
  AnalyticsIcon,
  ArrowsHorizontalIcon,
  ArrowsVerticalIcon,
  AsleepIcon,
  AsleepFilledIcon,
  AttachmentIcon,
  BatteryChargingIcon,
  BluetoothOffIcon,
  BookmarkIcon,
  BookmarkAddIcon,
  BookmarkFilledIcon,
  BotIcon,
  BullhornIcon,
  CalendarIcon,
  CameraIcon,
  ChartBarIcon,
  ChatIcon,
  ChatOffIcon,
  CheckboxCheckedIcon,
  CheckboxCheckedFilledIcon,
  CheckmarkIcon,
  CheckmarkFilledIcon,
  CheckmarkFilledErrorIcon,
  CheckmarkFilledWarningIcon,
  CheckmarkOutlineIcon,
  CheckmarkOutlineErrorIcon,
  CheckmarkOutlineWarningIcon,
  ChevronRightIcon,
  CircleDashIcon,
  CloseIcon,
  CloseFilledIcon,
  CloseLargeIcon,
  CloseOutlineIcon,
  CloudDownloadIcon,
  CloudOfflineIcon,
  CloudUploadIcon,
  CodeIcon,
  CopyIcon,
  CopyFileIcon,
  CopyLinkIcon,
  Cursor_1Icon,
  CutIcon,
  DashboardIcon,
  DocumentAddIcon,
  DocumentDownloadIcon,
  DocumentExportIcon,
  DocumentSubtractIcon,
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
  FavoriteHalfIcon,
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
  ImageIcon,
  InProgressIcon,
  InProgressErrorIcon,
  InProgressWarningIcon,
  IncompleteIcon,
  IncompleteCancelIcon,
  IncompleteErrorIcon,
  IncompleteWarningIcon,
  InformationIcon,
  InformationFilledIcon,
  InformationSquareIcon,
  InformationSquareFilledIcon,
  KeyboardIcon,
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
  MoonIcon,
  NotificationIcon,
  NotificationCounterIcon,
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
  PhoneIncomingIcon,
  PhoneOffIcon,
  PhoneOffFilledIcon,
  PhoneOutgoingIcon,
  PinIcon,
  PinFilledIcon,
  PlayIcon,
  PlayFilledIcon,
  PlayOutlineIcon,
  PlayOutlineFilledIcon,
  PlugIcon,
  PowerIcon,
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
  RssIcon,
  SaveIcon,
  SearchIcon,
  SendIcon,
  SendAltIcon,
  SendAltFilledIcon,
  SendFilledIcon,
  SettingsIcon,
  ShareIcon,
  ShoppingCartIcon,
  ShoppingCartClearIcon,
  ShoppingCartMinusIcon,
  ShoppingCartPlusIcon,
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
  ThumbsUpDoubleIcon,
  ThumbsUpFilledIcon,
  TimeIcon,
  TimeFilledIcon,
  TimerIcon,
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

/**
 * Marks scoped CSS global for Svelte, since `scopeCss` already scoped it:
 * each selector list in `:global()`, and each keyframe name `-global-`.
 */
const svelteGlobal = (css: string) =>
  css.replace(/([^{}]+)\{((?:[^{}]|\{[^{}]*\})*)\}/g, (_, prelude: string, body: string) => {
    const lead = prelude.match(/^\s*/)![0];
    const head = prelude.trim();
    if (head.startsWith("@keyframes ")) return `${lead}@keyframes -global-${head.slice(11)} {${body}}`;
    const selectors = head.split(/,\s*/).map((selector) => `:global(${selector})`);
    return `${lead}${selectors.join(`,\n${lead.replace(/^\n+/, "")}`)} {${body}}`;
  });

export const templateAnimated = ({ name, content, css, loop }: AnimatedIcon) => {
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
  data-animated-icon="${name}"
  data-motion={motion ?? defaults.motion ?? "productive"}
  use:animate={{ play, loop, loops: ${loop ? "true" : "false"}, motion, trigger, reducedMotion, hoverDelay, defaults }}
  {...attributes}
  {...$$restProps}>
  {#if title}<title>{title}</title>{/if}
  ${content}
</svg>

<style>
${svelteGlobal(scopeCss(name, loop ? withLoop(css) : css))}
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
     * \`TimeFilled\`, \`Timer\`).
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

/**
 * Sets defaults for every animated icon on the page, including icons outside
 * any component that calls \`setAnimatedIconDefaults\`. Later calls merge into
 * earlier ones, and apply from each icon's next play.
 *
 * An element can also set defaults for the icons inside it with data
 * attributes: \`data-animated-motion\`, \`data-animated-trigger\`,
 * \`data-animated-reduced-motion\` and \`data-animated-hover-delay\`.
 *
 * Props win, then \`setAnimatedIconDefaults\`, then the nearest data
 * attribute, then these.
 */
export declare function configureAnimatedIcons(defaults: CarbonAnimatedIconDefaults): void;

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
    'export { configureAnimatedIcons, setAnimatedIconDefaults } from "./animate.js";\n' +
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
