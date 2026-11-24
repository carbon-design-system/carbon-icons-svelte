<script>
  import {
    Button,
    Content,
    ContentSwitcher,
    FluidForm,
    CssColumn,
    CssGrid,
    Layer,
    Link,
    OverflowMenu,
    OverflowMenuItem,
    Prose,
    RadioButton,
    RadioButtonGroup,
    SidePanel,
    Switch,
    Search as SearchInput,
    Slider,
    TableOfContents,
    TableOfContentsItem,
    TextInput,
    Theme,
    Toolbar,
    ToolbarContent,
    Toggle,
    TooltipIcon,
  } from "carbon-components-svelte";
  import * as Animated from "carbon-icons-svelte/animated";
  import {
    Add,
    ArrowRight,
    Checkmark,
    CheckmarkFilled,
    ChevronLeft,
    ChevronRight,
    Copy,
    Download,
    Edit,
    Favorite,
    InProgress,
    Notification,
    PageFirst,
    PageLast,
    Renew,
    Search,
    Settings,
    TrashCan,
  } from "carbon-icons-svelte/animated";
  import { onMount, tick } from "svelte";
  import AnimatedDefaults from "./AnimatedDefaults.svelte";
  import Code from "./Code.svelte";

  const names = Object.keys(Animated)
    // Icons are the capitalized exports; the rest are functions like setAnimatedIconDefaults.
    .filter((name) => /^[A-Z]/.test(name))
    .sort();

  const groups = [
    { id: "animated-actions", title: "Actions", names: ["Add", "AddAlt", "AddFilled", "Close", "CloseOutline", "CloseFilled", "CloseLarge", "Subtract", "SubtractAlt", "SubtractLarge", "SubtractFilled", "Edit", "EditOff", "Save", "Copy", "CopyFile", "CopyLink", "TrashCan", "Download", "Upload", "DownToBottom", "UpToTop", "DocumentAdd", "DocumentSubtract", "DocumentDownload", "DocumentExport", "FolderAdd", "Printer", "CloudDownload", "CloudUpload", "Launch", "Send", "SendFilled", "SendAlt", "SendAltFilled", "Search", "SortAscending", "SortDescending", "ZoomIn", "ZoomOut", "ZoomReset", "Maximize", "Minimize", "Link", "Unlink", "Attachment", "Share", "Email", "EmailNew", "Chat", "ChatOff", "Code", "Cut", "Terminal", "Login", "Logout", "Calendar", "Phone", "PhoneFilled", "Alarm", "Power", "Plug", "Keyboard", "Cursor_1", "Bullhorn", "PhoneOff", "PhoneOffFilled", "PhoneIncoming", "PhoneOutgoing", "Camera", "Tag", "ShoppingCart", "ShoppingCartPlus", "ShoppingCartMinus", "ShoppingCartClear", "UserFollow", "Draggable", "Rocket", "Settings"] },
    {
      id: "animated-status",
      title: "Status",
      names: [
        "Checkmark",
        "CheckmarkOutline",
        "CheckmarkFilled",
        "CheckmarkOutlineError",
        "CheckmarkOutlineWarning",
        "CheckmarkFilledError",
        "CheckmarkFilledWarning",
        "CheckboxChecked",
        "CheckboxCheckedFilled",
        "RadioButtonChecked",
        "Warning",
        "WarningFilled",
        "WarningSquareFilled",
        "WarningHex",
        "WarningHexFilled",
        "WarningDiamond",
        "WarningAlt",
        "WarningAltFilled",
        "WarningAltInverted",
        "WarningAltInvertedFilled",
        "Error",
        "ErrorFilled",
        "ErrorOutline",
        "Misuse",
        "MisuseOutline",
        "Information",
        "InformationFilled",
        "InformationSquare",
        "InformationSquareFilled",
        "WarningSquare",
        "Help",
        "HelpFilled",
      ],
    },
    {
      id: "animated-feedback",
      title: "Feedback",
      names: [
        "Notification",
        "NotificationFilled",
        "NotificationNew",
        "NotificationCounter",
        "NotificationOff",
        "NotificationOffFilled",
        "Favorite",
        "FavoriteFilled",
        "FavoriteHalf",
        "Star",
        "StarFilled",
        "ThumbsUp",
        "ThumbsUpFilled",
        "ThumbsUpDouble",
        "ThumbsDown",
        "ThumbsDownFilled",
        "Bookmark",
        "BookmarkFilled",
        "BookmarkAdd",
        "Flag",
        "FlagFilled",
        "Idea",
        "Fire",
        "User",
        "UserFilled",
        "UserAvatar",
        "UserAvatarFilledAlt",
        "Analytics",
        "ChartBar",
        "Dashboard",
        "Activity",
        "Image",
        "Bot",
        "Gift",
        "Locked",
        "LockedFilled",
        "Unlocked",
        "UnlockedFilled",
        "View",
        "ViewOff",
        "ViewOffFilled",
        "Light",
        "LightFilled",
        "Sun",
        "Moon",
        "Asleep",
        "AsleepFilled",
        "Flash",
        "FlashFilled",
        "FlashOff",
        "FlashOffFilled",
        "Location",
        "LocationFilled",
        "Pin",
        "PinFilled",
        "Time",
        "TimeFilled",
        "Wifi",
        "WifiOff",
        "BluetoothOff",
        "CloudOffline",
        "BatteryCharging",
        "Rss",
        "VolumeUp",
        "VolumeUpFilled",
        "VolumeUpAlt",
        "VolumeDown",
        "VolumeDownFilled",
        "VolumeDownAlt",
        "VolumeMute",
        "VolumeMuteFilled",
        "MicrophoneOff",
        "MicrophoneOffFilled",
        "VideoOff",
        "VideoOffFilled",
      ],
    },
    {
      id: "animated-refresh",
      title: "Refresh and rotate",
      names: [
        "Renew",
        "RenewAlt",
        "Restart",
        "Reset",
        "Repeat",
        "Recycle",
        "RotateClockwise",
        "RotateClockwiseAlt",
        "RotateClockwiseFilled",
        "RotateClockwiseAltFilled",
        "RotateCounterclockwise",
        "RotateCounterclockwiseAlt",
        "RotateCounterclockwiseFilled",
        "RotateCounterclockwiseAltFilled",
      ],
    },
    {
      id: "animated-progress",
      title: "Progress",
      names: ["CircleDash", "InProgress", "Incomplete", "Pending", "PendingFilled", "Hourglass", "Timer", "InProgressError", "InProgressWarning", "IncompleteError", "IncompleteWarning", "IncompleteCancel"],
    },
    {
      id: "animated-media",
      title: "Media",
      names: ["Play", "PlayFilled", "PlayOutline", "PlayOutlineFilled", "Pause", "PauseFilled", "PauseOutline", "PauseOutlineFilled", "Stop", "StopFilled", "StopOutline", "StopOutlineFilled"],
    },
    {
      id: "animated-navigation",
      title: "Navigation",
      names: [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUpLeft",
        "ArrowUpRight",
        "ArrowDownLeft",
        "ArrowDownRight",
        "ArrowShiftDown",
        "ArrowsVertical",
        "ArrowsHorizontal",
        "ChevronUp",
        "ChevronDown",
        "ChevronLeft",
        "ChevronRight",
        "DoubleChevronLeft",
        "DoubleChevronRight",
        "CaretUp",
        "CaretDown",
        "CaretLeft",
        "CaretRight",
        "PageFirst",
        "PageLast",
        "SkipBack",
        "SkipBackFilled",
        "SkipForward",
        "SkipForwardFilled",
        "JumpLink",
        "Undo",
        "Redo",
        "Menu",
        "OverflowMenuVertical",
        "OverflowMenuHorizontal",
      ],
    },
  ];

  const grouped = new Set(groups.flatMap((group) => group.names));
  const ungrouped = names.filter((name) => !grouped.has(name));
  if (ungrouped.length > 0) groups.push({ id: "animated-other", title: "Other", names: ungrouped });

  // Each section's link carries an animated icon, which plays on hover.
  const sections = [
    ["animated-icons", "Animated icons", "Star"],
    ["animated-overview", "Usage", "Code"],
    ["animated-guidance", "Guidance", "Information"],
    ["animated-motion", "Motion", "Activity"],
    ["animated-carbon", "In Carbon components", "Add"],
    ["animated-events", "Play on an event", "Play"],
    ["animated-loop", "Loop", "Renew"],
    ["animated-states", "Icons for each state", "CheckmarkOutline"],
    ["animated-patterns", "Patterns", "Idea"],
    ["animated-defaults", "Defaults", "Settings"],
    ["animated-accessibility", "Accessibility", "ViewOff"],
    ["animated-ssr", "Server rendering", "Terminal"],
    ["animated-performance", "Performance", "Dashboard"],
    ["animated-props", "Props", "Edit"],
  ];

  const sizeMarks = [16, 20, 24, 32].map((value) => ({ value, label: `${value}` }));

  const motionIcons = [Notification, Renew, Download, Favorite, Checkmark];

  let saved = 0;
  let unread = 0;
  let refreshing = false;
  let loading = true;

  const refresh = () => {
    refreshing = true;
    setTimeout(() => (refreshing = false), 2500);
  };

  /** @type {"idle" | "active" | "done"} */
  let status = "idle";
  let copied = false;

  const download = () => {
    status = "active";
    setTimeout(() => {
      status = "done";
      setTimeout(() => (status = "idle"), 2000);
    }, 2500);
  };

  const copy = () => {
    copied = true;
    setTimeout(() => (copied = false), 2000);
  };
  let motionPlay = 0;

  let name = "Notification";
  let explorerOpen = false;

  const explore = (option) => {
    name = option;
    size = iconSize;
    explorerOpen = true;
  };
  let motion = "productive";
  let trigger = "hover";
  let reducedMotion = "static";
  let hoverDelay = 150;
  let size = 16;
  let play = 0;
  let loopChoice = "false";
  $: loop = loopChoice === "true";

  // The open panel and its non-default props live in the URL's query, so a
  // link reopens the explorer as it was. The hash stays the page route.
  const PROP_DEFAULTS = { size: 16, motion: "productive", trigger: "hover", reducedMotion: "static", hoverDelay: 150, loop: "false" };
  const oneOf = (value, options, fallback) => (options.includes(value) ? value : fallback);
  const iconSizes = [16, 20, 24, 32];

  /** What each gallery control does, for its tooltip. */
  const controlInfo = {
    motion: "Productive is a short, subtle move for routine UI. Expressive is larger, for events people should notice. Switching plays every icon, and the play button replays them.",
    loop: "Shows only the icons that can loop, looping, as they do with loop set to true.",
  };

  /** What each prop in the explorer does, and its default, for its tooltip. */
  const propInfo = {
    size: ["Width and height in pixels. Carbon's sizes are 16, 20, 24 and 32.", "16"],
    motion: ["productive is a short, subtle move for routine UI. expressive is larger, for events people should notice.", "productive"],
    trigger: ["hover plays the icon when the pointer rests on it or on the button or link around it, or when that gets keyboard focus. none plays it only through play.", "hover"],
    hoverDelay: ["How long the pointer rests before the icon plays.", "150"],
    reducedMotion: ["What users who prefer reduced motion see. static: nothing plays. fade: the icon dims and comes back. full: the normal animation plays.", "static"],
    loop: ["Repeats the animation while true. When it turns false, the current cycle finishes. Only progress, refresh and waiting icons loop.", "false"],
  };
  const hoverDelays = [0, 150, 300, 600];
  let urlReady = false;

  let linkCopied = false;
  const copyLink = async () => {
    await navigator.clipboard.writeText(permalink);
    linkCopied = true;
    setTimeout(() => (linkCopied = false), 2000);
  };

  onMount(() => {
    const params = new URLSearchParams(location.search);
    const icon = params.get("icon");
    // A missing number reads as NaN, not 0, which is a valid hoverDelay.
    const number = (key) => (params.has(key) ? Number(params.get(key)) : NaN);
    if (icon && names.includes(icon)) {
      name = icon;
      size = oneOf(number("size"), iconSizes, PROP_DEFAULTS.size);
      motion = oneOf(params.get("motion"), ["productive", "expressive"], PROP_DEFAULTS.motion);
      trigger = oneOf(params.get("trigger"), ["hover", "none"], PROP_DEFAULTS.trigger);
      reducedMotion = oneOf(params.get("reducedMotion"), ["static", "fade", "full"], PROP_DEFAULTS.reducedMotion);
      hoverDelay = oneOf(number("hoverDelay"), hoverDelays, PROP_DEFAULTS.hoverDelay);
      loopChoice = oneOf(params.get("loop"), ["true", "false"], PROP_DEFAULTS.loop);
      explorerOpen = true;
    }
    urlReady = true;
  });

  /** The query for the explorer's state: the icon, then every prop that isn't its default. */
  const explorerQuery = (open, state) => {
    if (!open) return "";
    const params = new URLSearchParams({ icon: state.name });
    for (const key of Object.keys(PROP_DEFAULTS)) {
      if (String(state[key]) !== String(PROP_DEFAULTS[key])) params.set(key, String(state[key]));
    }
    return `?${params}`;
  };

  $: query = explorerQuery(explorerOpen, { name, size, motion, trigger, reducedMotion, hoverDelay, loop: loopChoice });
  $: permalink = typeof location === "undefined" ? "" : `${location.origin}${location.pathname}${query}#animated`;
  $: if (urlReady && query !== location.search) {
    history.replaceState(history.state, "", `${location.pathname}${query}${location.hash}`);
  }
  let galleryMotionIndex = 0;

  // Changing a motion control plays the icons in the new mode, so the
  // difference shows without hovering. Only on change, not on load. Wait
  // for the new mode to render before playing.
  const replayGallery = async () => {
    await tick();
    galleryPlay++;
  };
  const replayExplorer = async () => {
    await tick();
    play++;
  };
  let galleryQuery = "";
  let galleryPlay = 0;
  let galleryLoop = false;

  // The icons that loop. The components don't expose it, so it's listed here.
  const looping = new Set(["CircleDash", "Hourglass", "InProgress", "Incomplete", "Pending", "PendingFilled", "Renew", "RenewAlt", "Restart", "Reset", "Repeat", "Recycle", "Settings", "Terminal", "Time", "TimeFilled", "Timer"]);

  const normalize = (text) => text.toLowerCase().replace(/[\s_-]+/g, "");
  $: queryKey = normalize(galleryQuery);
  // Announce the number of matches once typing pauses, so a screen reader
  // isn't interrupted on every keystroke.
  let searchStatus = "";
  let statusTimer;
  $: {
    clearTimeout(statusTimer);
    const count = visibleGroups.reduce((total, group) => total + group.names.length, 0);
    const text = queryKey
      ? count === 0
        ? `No animated icons match ${galleryQuery.trim()}`
        : `${count} ${count === 1 ? "icon matches" : "icons match"} ${galleryQuery.trim()}`
      : "";
    statusTimer = setTimeout(() => (searchStatus = text), 500);
  }

  /**
   * One tab stop for the whole gallery: the arrow keys move between tiles,
   * Up and Down to the nearest tile in the row above or below, and Home and
   * End to the first and last tile.
   */
  function rovingFocus(node) {
    let current = null;
    const tiles = () => [...node.querySelectorAll(".gallery button")];
    const sync = () => {
      const all = tiles();
      if (!all.includes(current)) current = all[0] ?? null;
      for (const tile of all) tile.tabIndex = tile === current ? 0 : -1;
    };
    const rowStep = (from, direction) => {
      const box = from.getBoundingClientRect();
      const center = box.left + box.width / 2;
      const rows = tiles().filter((tile) => {
        const top = tile.getBoundingClientRect().top;
        return direction > 0 ? top > box.top + 1 : top < box.top - 1;
      });
      if (rows.length === 0) return null;
      const tops = rows.map((tile) => tile.getBoundingClientRect().top);
      const rowTop = direction > 0 ? Math.min(...tops) : Math.max(...tops);
      const row = rows.filter((tile) => Math.abs(tile.getBoundingClientRect().top - rowTop) < 1);
      const distance = (tile) => {
        const b = tile.getBoundingClientRect();
        return Math.abs(b.left + b.width / 2 - center);
      };
      return row.reduce((best, tile) => (distance(tile) < distance(best) ? tile : best));
    };
    const onKeydown = (event) => {
      const all = tiles();
      const index = all.indexOf(event.target);
      if (index === -1) return;
      const next = {
        ArrowRight: all[index + 1],
        ArrowLeft: all[index - 1],
        ArrowDown: event.key === "ArrowDown" && rowStep(all[index], 1),
        ArrowUp: event.key === "ArrowUp" && rowStep(all[index], -1),
        Home: all[0],
        End: all[all.length - 1],
      }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      if (!next) return;
      current = next;
      sync();
      next.focus();
    };
    const onFocusin = (event) => {
      if (tiles().includes(event.target)) {
        current = event.target;
        sync();
      }
    };
    node.addEventListener("keydown", onKeydown);
    node.addEventListener("focusin", onFocusin);
    sync();
    return {
      update: () => queueMicrotask(sync),
      destroy() {
        node.removeEventListener("keydown", onKeydown);
        node.removeEventListener("focusin", onFocusin);
      },
    };
  }

  $: visibleGroups = groups
    .map((group) => ({
      ...group,
      names: group.names.filter((option) => (!galleryLoop || looping.has(option)) && normalize(option).includes(queryKey)),
    }))
    .filter((group) => group.names.length > 0);

  // Shared with the icon list's theme select.
  const themes = ["white", "g10", "g80", "g90", "g100"];
  let theme = "white";
  $: dark = ["g80", "g90", "g100"].includes(theme);
  let themeSwitches = 0;

  let email = "";
  let attempts = 0;
  /** @type {"idle" | "invalid" | "done"} */
  let submitStatus = "idle";
  const submit = () => {
    attempts++;
    submitStatus = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "done" : "invalid";
  };

  let signupEmail = "";
  let signupAttempts = 0;
  /** @type {"idle" | "sending" | "invalid" | "done"} */
  let signupStatus = "idle";
  const signUp = () => {
    signupAttempts++;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail)) {
      signupStatus = "invalid";
      return;
    }
    signupStatus = "sending";
    setTimeout(() => (signupStatus = "done"), 1800);
  };

  const fluidCode = `<script>
  import { Button, FluidForm, TextInput } from "carbon-components-svelte";
  import { CheckmarkFilled, ErrorFilled, InProgress, Send } from "carbon-icons-svelte/animated";

  let email = "";
  let attempts = 0;
  let status = "idle";

  async function join() {
    attempts++;
    if (!isEmail(email)) {
      status = "invalid";
      return;
    }
    status = "sending";
    await joinWaitlist(email);
    status = "done";
  }
<\/script>

<FluidForm on:submit={(event) => { event.preventDefault(); join(); }}>
  <TextInput labelText="Name" />
  <TextInput
    labelText="Email"
    bind:value={email}
    invalid={status === "invalid"}
    invalidText="Enter an email address, like name@example.com."
    on:input={() => (status = "idle")}
  />
  <TextInput labelText="Company" />
  <Button type="submit" disabled={status === "sending" || status === "done"}>
    {status === "done" ? "You're on the list" : "Join the waitlist"}
    <svelte:fragment slot="icon">
      {#if status === "sending"}
        <InProgress class="bx--btn__icon" loop />
      {:else if status === "done"}
        <CheckmarkFilled class="bx--btn__icon" play motion="expressive" />
      {:else if status === "invalid"}
        <ErrorFilled class="bx--btn__icon" play={attempts} trigger="none" motion="expressive" />
      {:else}
        <Send class="bx--btn__icon" />
      {/if}
    </svelte:fragment>
  </Button>
</FluidForm>`;

  // A secret shown in a read-only field, not a password input, so the
  // browser doesn't offer to save a password.
  const apiKey = "sk_live_51NcQ8rT2vX";
  const maskedKey = "•".repeat(apiKey.length);
  let secretVisible = false;
  let secretToggles = 0;
  let favorited = false;
  let bookmarked = false;

  const toolbarCode = `<script>
  import { Button, Toolbar, ToolbarContent } from "carbon-components-svelte";
  import { Copy, Download, Edit, Share, TrashCan } from "carbon-icons-svelte/animated";
<\/script>

<Toolbar ariaLabel="Document actions">
  <ToolbarContent>
    <Button kind="ghost" icon={Edit} iconDescription="Edit" />
    <Button kind="ghost" icon={Copy} iconDescription="Copy" />
    <Button kind="ghost" icon={Share} iconDescription="Share" />
    <Button kind="ghost" icon={Download} iconDescription="Download" />
    <Button kind="ghost" icon={TrashCan} iconDescription="Delete" />
  </ToolbarContent>
</Toolbar>`;

  const submitCode = `<script>
  import { Button, TextInput } from "carbon-components-svelte";
  import { CheckmarkFilled, ErrorFilled, Send } from "carbon-icons-svelte/animated";

  let email = "";
  let attempts = 0;
  let status = "idle";

  function submit() {
    attempts++;
    status = isEmail(email) ? "done" : "invalid";
  }
<\/script>

<TextInput
  labelText="Email"
  bind:value={email}
  invalid={status === "invalid"}
  invalidText="Enter an email address, like name@example.com."
  on:input={() => (status = "idle")}
/>
<Button size="field" on:click={submit}>
  Subscribe
  <svelte:fragment slot="icon">
    {#if status === "done"}
      <CheckmarkFilled class="bx--btn__icon" play motion="expressive" />
    {:else if status === "invalid"}
      <ErrorFilled class="bx--btn__icon" play={attempts} trigger="none" motion="expressive" />
    {:else}
      <Send class="bx--btn__icon" />
    {/if}
  </svelte:fragment>
</Button>`;

  const secretCode = `<script>
  import { Button, TextInput } from "carbon-components-svelte";
  import { View, ViewOff } from "carbon-icons-svelte/animated";

  export let apiKey;

  let visible = false;
  let toggles = 0;

  $: masked = "•".repeat(apiKey.length);
<\/script>

<TextInput labelText="API key" readonly value={visible ? apiKey : masked} />
<Button
  kind="ghost"
  size="field"
  iconDescription={visible ? "Hide API key" : "Show API key"}
  on:click={() => {
    visible = !visible;
    toggles++;
  }}
>
  <svelte:fragment slot="icon">
    {#if visible}
      <ViewOff class="bx--btn__icon" play={toggles} />
    {:else}
      <View class="bx--btn__icon" play={toggles} />
    {/if}
  </svelte:fragment>
</Button>`;

  const togglesCode = `<script>
  import { Button } from "carbon-components-svelte";
  import { Favorite, FavoriteFilled } from "carbon-icons-svelte/animated";

  let favorited = false;
<\/script>

<Button
  kind="ghost"
  iconDescription={favorited ? "Remove from favorites" : "Add to favorites"}
  aria-pressed={favorited}
  on:click={() => (favorited = !favorited)}
>
  <svelte:fragment slot="icon">
    {#if favorited}
      <FavoriteFilled class="bx--btn__icon" play motion="expressive" />
    {:else}
      <Favorite class="bx--btn__icon" />
    {/if}
  </svelte:fragment>
</Button>`;

  const themeCode = `<script>
  import { Button, Theme } from "carbon-components-svelte";
  import { Moon, Sun } from "carbon-icons-svelte/animated";

  let theme = "white";
  let switches = 0;

  $: dark = theme === "g100";
<\/script>

<Theme bind:theme persist />
<Button
  kind="ghost"
  iconDescription={dark ? "Switch to light theme" : "Switch to dark theme"}
  on:click={() => {
    theme = dark ? "white" : "g100";
    switches++;
  }}
>
  <svelte:fragment slot="icon">
    {#if dark}
      <Sun class="bx--btn__icon" play={switches} />
    {:else}
      <Moon class="bx--btn__icon" play={switches} />
    {/if}
  </svelte:fragment>
</Button>`;
  $: galleryMotion = galleryMotionIndex === 1 ? "expressive" : "productive";
  /** The icon size picked on either page, saved by the parent. */
  export let iconSize = 24;

  $: explorerProps = [
    size !== 16 && `size={${size}}`,
    motion !== "productive" && `motion="${motion}"`,
    trigger !== "hover" && `trigger="${trigger}"`,
    reducedMotion !== "static" && `reducedMotion="${reducedMotion}"`,
    hoverDelay !== 150 && `hoverDelay={${hoverDelay}}`,
    trigger === "none" && "play={count}",
    loop && "loop={loading}",
  ].filter(Boolean);

  // The tag stays on one line if it fits Prettier's default 80 columns,
  // which the panel shows without scrolling; otherwise one prop per line.
  $: explorerLine = `<${name}${explorerProps.map((prop) => ` ${prop}`).join("")} />`;
  $: explorerTag =
    explorerLine.length <= 80
      ? explorerLine
      : `<${name}\n${explorerProps.map((prop) => `  ${prop}`).join("\n")}\n/>`;

  $: explorerCode = `<script>
  import { ${name} } from "carbon-icons-svelte/animated";${trigger === "none" ? "\n\n  let count = 0;" : ""}
<\/script>
${trigger === "none" ? '\n<button on:click={() => count++}>Play</button>\n' : ""}
${explorerTag}`;

  const importCode = `<script>
  import { Notification } from "carbon-icons-svelte/animated";
<\/script>

<button>
  <Notification /> Notifications
</button>`;

  const componentsCode = `<script>
  import { Button, Link, OverflowMenu } from "carbon-components-svelte";
  import {
    Add,
    ArrowRight,
    Notification,
    Settings,
  } from "carbon-icons-svelte/animated";
<\/script>

<Button icon={Add}>Add item</Button>
<Button kind="ghost" icon={Notification} iconDescription="Notifications" />
<Link href="#" icon={ArrowRight}>Learn more</Link>
<OverflowMenu icon={Settings} />`;

  const eventCode = `<script>
  import { Button } from "carbon-components-svelte";
  import { Checkmark } from "carbon-icons-svelte/animated";

  let saved = 0;
<\/script>

<Button on:click={() => saved++}>
  Save
  <Checkmark slot="icon" class="bx--btn__icon"
    play={saved} trigger="none" motion="expressive" />
</Button>`;

  const defaultsCode = `<script>
  import { setAnimatedIconDefaults } from "carbon-icons-svelte/animated";

  setAnimatedIconDefaults({ motion: "expressive", hoverDelay: 0 });
<\/script>`;

  const loopCode = `<script>
  import { Button } from "carbon-components-svelte";
  import { Renew } from "carbon-icons-svelte/animated";

  let refreshing = false;

  async function refresh() {
    refreshing = true;
    await reload(); // your request
    refreshing = false;
  }
<\/script>

<Button kind="tertiary" disabled={refreshing} on:click={refresh}>
  Refresh
  <Renew slot="icon" class="bx--btn__icon" loop={refreshing} />
</Button>`;

  const statesCode = `<script>
  import { Button } from "carbon-components-svelte";
  import { CheckmarkFilled, Download, InProgress } from "carbon-icons-svelte/animated";

  let status = "idle"; // "idle" | "active" | "done"

  async function download() {
    status = "active";
    await save(); // your request
    status = "done";
    setTimeout(() => (status = "idle"), 2000);
  }
<\/script>

<Button kind="secondary" disabled={status === "active"} on:click={download}>
  Download
  <svelte:fragment slot="icon">
    {#if status === "active"}
      <InProgress class="bx--btn__icon" loop />
    {:else if status === "done"}
      <CheckmarkFilled class="bx--btn__icon" play motion="expressive" />
    {:else}
      <Download class="bx--btn__icon" />
    {/if}
  </svelte:fragment>
</Button>`;

  const reducedCode = `<Checkmark play={saved} trigger="none" reducedMotion="fade" />`;
</script>

<Content>
<CssGrid class="page">
  <CssColumn sm={4} md={8} lg={4} class="toc-column">
    <div class="toc">
      <TableOfContents labelText="On this page" size="sm" scrollOffset={64}>
        {#each sections as [id, text, icon] (id)}
          <TableOfContentsItem href="#{id}">
            <svelte:component this={Animated[icon]} />
            {text}
          </TableOfContentsItem>
          {#if id === "animated-icons"}
            {#each groups as group (group.id)}
              <TableOfContentsItem href="#{group.id}" level={2}>
                {group.title}
                <span class="toc-count">{group.names.length}</span>
              </TableOfContentsItem>
            {/each}
          {/if}
        {/each}
      </TableOfContents>
    </div>
  </CssColumn>

  <CssColumn sm={4} md={8} lg={12}>
    <Prose maxWidth="none">
      <section id="animated-icons">
        <!-- The page's only h1, sized like the other sections so the gallery starts high. -->
        <h1 class="page-title">Animated icons</h1>
        <p>
          Carbon icons that animate on hover, keyboard focus or when you play them.
        </p>
        <Theme bind:theme persist persistKey="theme" />
        <div class="gallery-search">
          <SearchInput
            size="lg"
            labelText="Search animated icons"
            placeholder="Search {names.length} animated icons"
            bind:value={galleryQuery}
          />
        </div>
        <div class="gallery-controls">
          <div class="gallery-motion">
            <div class="control-label">
              <span id="gallery-motion-label" class="bx--label">Motion</span>
              <TooltipIcon icon={Animated.Information} direction="top" align="start" portalTooltip>
                <span slot="tooltipText">{controlInfo.motion}</span>
              </TooltipIcon>
            </div>
            <div class="gallery-motion-row">
              <ContentSwitcher size="sm" autoWidth lowContrast aria-labelledby="gallery-motion-label" bind:selectedIndex={galleryMotionIndex} on:change={replayGallery}>
                <Switch text="Productive" />
                <Switch text="Expressive" />
              </ContentSwitcher>
              <Button
                kind="ghost"
                size="small"
                icon={Animated.Play}
                iconDescription="Play all"
                tooltipPosition="bottom"
                on:click={() => galleryPlay++}
              />
            </div>
          </div>
          <div class="gallery-size">
            <div class="control-label">
              <span id="gallery-size-label" class="bx--label">Size</span>
            </div>
            <Slider
            labelText="Size"
            hideLabel
            min={16}
            max={32}
            marks={sizeMarks}
            snapToMarks
            hideTextInput
            hideRangeLabels
            formatValue={(value) => `${value}px`}
            bind:value={iconSize}
          />
          </div>
          <div class="gallery-theme">
            <div class="control-label">
              <span id="gallery-theme-label" class="bx--label">Theme</span>
            </div>
            <ContentSwitcher
              size="sm"
              autoWidth
              lowContrast
              aria-labelledby="gallery-theme-label"
              selectedIndex={Math.max(0, themes.indexOf(theme))}
              on:change={({ detail }) => (theme = themes[detail])}
            >
              {#each themes as option (option)}
                <Switch text={option} />
              {/each}
            </ContentSwitcher>
          </div>
          <div class="gallery-loop">
            <div class="control-label">
              <span id="gallery-loop-label" class="bx--label">Loop</span>
              <TooltipIcon icon={Animated.Information} direction="top" align="start" portalTooltip>
                <span slot="tooltipText">{controlInfo.loop}</span>
              </TooltipIcon>
            </div>
            <Toggle labelText="Loop" hideLabel size="sm" bind:toggled={galleryLoop}>
              <span slot="labelA">Off</span>
              <span slot="labelB">On</span>
            </Toggle>
          </div>
        </div>
        {#if visibleGroups.length === 0}
          <p class="gallery-empty">No animated icons match “{galleryQuery.trim()}”.</p>
        {/if}
        <p class="visually-hidden" aria-live="polite">{searchStatus}</p>
        <p id="gallery-keys" class="visually-hidden">Use the arrow keys to move between icons.</p>
        <div class="gallery-groups" role="group" aria-label="Animated icons" aria-describedby="gallery-keys" use:rovingFocus={visibleGroups}>
        {#each visibleGroups as group (group.id)}
          <h3 id={group.id}>{group.title}</h3>
          <div class="gallery">
            {#each group.names as option (option)}
              <button type="button" on:click={() => explore(option)}>
                <span class="tile-icon">
                  <svelte:component this={Animated[option]} size={iconSize} motion={galleryMotion} play={galleryPlay} loop={galleryLoop} />
                </span>
                <span class="tile-name">
                  {#each option.split(/(?=[A-Z_])/) as word, i}{#if i}<wbr />{/if}{word}{/each}
                </span>
              </button>
            {/each}
          </div>
        {/each}
        </div>
      </section>

      <section id="animated-overview">
        <h2>Usage</h2>
        <p>
          Import animated icons from <code>carbon-icons-svelte/animated</code>. They take the same props as the static icons.
        </p>
        <p>
          An icon plays when the pointer rests on it, or on the button or link around it, for 150ms. It also plays when that button or link gets keyboard focus. Moving the pointer across a toolbar plays nothing. Once an icon starts, it plays to the end.
        </p>
        <Code code={importCode} />
      </section>

      <section id="animated-guidance">
        <h2>Guidance</h2>
        <ul>
          <li>
            Animate an icon only when its motion shows what it does, like a bell ringing or an arrow moving the way it points. Logos and nouns stay static.
          </li>
          <li>
            Use productive motion for routine UI like toolbars, menus and navigation. Use expressive motion for events people should notice, like a save or a new message, and trigger it with <code>play</code>.
          </li>
          <li>
            Loop only progress, refresh and waiting icons, and only while the work runs. Everything else plays once.
          </li>
          <li>
            Keep the hover delay, unless the pointer is meant to rest on a single control, like one call to action.
          </li>
          <li>
            Keep text labels. Icon-only buttons still need an <code>iconDescription</code>, and state changes still need to be announced. See <a href="#animated-accessibility">Accessibility</a>.
          </li>
        </ul>
      </section>

      <section id="animated-motion">
        <h2>Motion</h2>
        <p>
          <code>motion</code> picks one of Carbon's two motion styles, with Carbon's durations and easings. <code>"productive"</code>, the default, is one short move of 400ms or less. <code>"expressive"</code> runs up to 700ms and adds secondary motion and overshoot.
        </p>
        <div class="demo motion-compare">
          {#each ["productive", "expressive"] as mode (mode)}
            <div class="motion-mode">
              <span class="motion-label">{mode}</span>
              <span class="motion-icons">
                {#each motionIcons as Icon}
                  <Icon motion={mode} trigger="none" play={motionPlay} />
                {/each}
              </span>
            </div>
          {/each}
          <Button kind="tertiary" size="small" on:click={() => motionPlay++}>Play both</Button>
        </div>
      </section>

      <section id="animated-carbon">
        <h2>In Carbon components</h2>
        <p>Pass an animated icon wherever a component takes an <code>icon</code>. Hover or tab to each one.</p>
        <div class="example">
        <div class="demo">
          <div class="demo-row">
            <Button icon={Add}>Add item</Button>
            <Button kind="secondary" icon={Download}>Download</Button>
            <Button kind="tertiary" icon={Renew}>Refresh</Button>
            <Button kind="ghost" icon={Edit}>Edit</Button>
            <Button kind="danger" icon={TrashCan}>Delete</Button>
          </div>
          <div class="demo-row">
            <Button kind="ghost" icon={Notification} iconDescription="Notifications" />
            <Button kind="ghost" icon={Search} iconDescription="Search" />
            <Button kind="ghost" icon={Favorite} iconDescription="Favorite" />
            <Button kind="ghost" icon={Copy} iconDescription="Copy" />
            <Button kind="ghost" icon={Settings} iconDescription="Settings" />
            <span class="divider"></span>
            <Button kind="ghost" size="small" icon={PageFirst} iconDescription="First page" />
            <Button kind="ghost" size="small" icon={ChevronLeft} iconDescription="Previous page" />
            <Button kind="ghost" size="small" icon={ChevronRight} iconDescription="Next page" />
            <Button kind="ghost" size="small" icon={PageLast} iconDescription="Last page" />
            <span class="divider"></span>
            <Link href="#animated-carbon" icon={ArrowRight}>Learn more</Link>
            <OverflowMenu icon={Settings}>
              <OverflowMenuItem text="Rename" />
              <OverflowMenuItem text="Duplicate" />
            </OverflowMenu>
          </div>
        </div>
        <Code code={componentsCode} />
        </div>
      </section>

      <section id="animated-events">
        <h2>Play on an event</h2>
        <p>
          To play an icon from your own state, pass a number to <code>play</code> and increment it. The icon plays each time the value changes to something truthy. To give props to an icon in a <code>Button</code>, put it in the button's <code>icon</code> slot with the <code>bx--btn__icon</code> class.
        </p>
        <div class="example">
        <div class="demo">
          <div class="demo-row">
            <Button on:click={() => saved++}>
              Save
              <Checkmark slot="icon" class="bx--btn__icon" play={saved} trigger="none" motion="expressive" />
            </Button>
            <Button kind="ghost" iconDescription="Notifications ({unread} unread)">
              <Notification slot="icon" class="bx--btn__icon" play={unread} trigger="none" motion="expressive" />
            </Button>
            <Button kind="tertiary" size="small" on:click={() => unread++}>Simulate a notification</Button>
          </div>
        </div>
        <Code code={eventCode} />
        </div>
      </section>

      <section id="animated-loop">
        <h2>Loop</h2>
        <p>
          Set <code>loop</code> to repeat an icon's animation while something is in progress. When <code>loop</code> turns <code>false</code>, the current cycle finishes and the icon stops at rest. Hover and <code>play</code> don't interrupt a loop, and loops pause while scrolled out of view. Only progress, refresh and waiting icons loop.
        </p>
        <div class="example">
        <div class="demo">
          <div class="demo-row">
            <Button kind="tertiary" disabled={refreshing} on:click={refresh}>
              Refresh
              <Renew slot="icon" class="bx--btn__icon" loop={refreshing} />
            </Button>
          </div>
          <div class="demo-row">
            <Toggle labelText="Loading" size="sm" bind:toggled={loading} />
            {#each ["CircleDash", "InProgress", "Incomplete", "Pending", "PendingFilled"] as option (option)}
              <svelte:component this={Animated[option]} size={24} loop={loading} title={option} />
            {/each}
          </div>
        </div>
        <Code code={loopCode} />
        </div>
      </section>

      <section id="animated-states">
        <h2>Icons for each state</h2>
        <p>
          To show a different icon for each state of a button, swap icons in an <code>{"{#if}"}</code> block inside <code>&lt;svelte:fragment slot="icon"&gt;</code>. Here, <code>Download</code> plays on hover, <code>InProgress</code> loops during the download, and <code>CheckmarkFilled</code> plays once when it finishes, because an icon that mounts with a truthy <code>play</code> plays immediately. Give each icon the <code>bx--btn__icon</code> class for the button's spacing and color.
        </p>
        <div class="example">
        <div class="demo">
          <div class="demo-row">
            <Button kind="secondary" disabled={status === "active"} on:click={download}>
              Download
              <svelte:fragment slot="icon">
                {#if status === "active"}
                  <InProgress class="bx--btn__icon" loop />
                {:else if status === "done"}
                  <CheckmarkFilled class="bx--btn__icon" play motion="expressive" />
                {:else}
                  <Download class="bx--btn__icon" />
                {/if}
              </svelte:fragment>
            </Button>
            <Button kind="ghost" iconDescription={copied ? "Copied" : "Copy"} on:click={copy}>
              <svelte:fragment slot="icon">
                {#if copied}
                  <Checkmark class="bx--btn__icon" play style="margin-left: 0" />
                {:else}
                  <Copy class="bx--btn__icon" style="margin-left: 0" />
                {/if}
              </svelte:fragment>
            </Button>
          </div>
        </div>
        <Code code={statesCode} />
        </div>
      </section>

      <section id="animated-patterns">
        <h2>Patterns</h2>
        <p>
          Examples built with Carbon components.
        </p>
        <h3 id="animated-pattern-toolbar">Toolbar</h3>
        <p>
          Icon-only buttons in a <code>Toolbar</code>. Moving the pointer across the toolbar plays nothing. Resting it on a button plays that button's icon.
        </p>
        <div class="example">
          <div class="demo">
            <Toolbar ariaLabel="Document actions">
              <ToolbarContent>
                <Button kind="ghost" icon={Animated.Edit} iconDescription="Edit" />
                <Button kind="ghost" icon={Animated.Copy} iconDescription="Copy" />
                <Button kind="ghost" icon={Animated.Share} iconDescription="Share" />
                <Button kind="ghost" icon={Animated.Download} iconDescription="Download" />
                <Button kind="ghost" icon={Animated.TrashCan} iconDescription="Delete" />
              </ToolbarContent>
            </Toolbar>
          </div>
          <Code code={toolbarCode} />
        </div>

        <h3 id="animated-pattern-submit">Form submission</h3>
        <p>
          The button's icon shows the result. If the email is invalid, the error icon shakes, and it shakes again on each failed attempt because <code>play</code> gets the attempt count. If the email is valid, the check plays.
        </p>
        <div class="example">
          <div class="demo">
            <div class="demo-row form-row">
              <TextInput
                labelText="Email"
                placeholder="name@example.com"
                bind:value={email}
                invalid={submitStatus === "invalid"}
                invalidText="Enter an email address, like name@example.com."
                on:input={() => (submitStatus = "idle")}
              />
              <Button size="field" on:click={submit}>
                Subscribe
                <svelte:fragment slot="icon">
                  {#if submitStatus === "done"}
                    <Animated.CheckmarkFilled class="bx--btn__icon" play motion="expressive" />
                  {:else if submitStatus === "invalid"}
                    <Animated.ErrorFilled class="bx--btn__icon" play={attempts} trigger="none" motion="expressive" />
                  {:else}
                    <Animated.Send class="bx--btn__icon" />
                  {/if}
                </svelte:fragment>
              </Button>
            </div>
          </div>
          <Code code={submitCode} />
        </div>

        <h3 id="animated-pattern-fluid-form">Fluid form</h3>
        <p>
          The submit button's icon follows the request: <code>Send</code> before submitting, <code>InProgress</code> looping while the request runs, then <code>CheckmarkFilled</code>. An invalid email plays <code>ErrorFilled</code> instead.
        </p>
        <div class="example">
          <div class="demo">
            <FluidForm
              class="fluid-demo"
              on:submit={(event) => {
                event.preventDefault();
                signUp();
              }}
            >
              <TextInput labelText="Name" />
              <TextInput
                labelText="Email"
                placeholder="name@example.com"
                bind:value={signupEmail}
                invalid={signupStatus === "invalid"}
                invalidText="Enter an email address, like name@example.com."
                on:input={() => (signupStatus = "idle")}
              />
              <TextInput labelText="Company" />
              <Button type="submit" disabled={signupStatus === "sending" || signupStatus === "done"}>
                {signupStatus === "done" ? "You're on the list" : "Join the waitlist"}
                <svelte:fragment slot="icon">
                  {#if signupStatus === "sending"}
                    <Animated.InProgress class="bx--btn__icon" loop />
                  {:else if signupStatus === "done"}
                    <Animated.CheckmarkFilled class="bx--btn__icon" play motion="expressive" />
                  {:else if signupStatus === "invalid"}
                    <Animated.ErrorFilled class="bx--btn__icon" play={signupAttempts} trigger="none" motion="expressive" />
                  {:else}
                    <Animated.Send class="bx--btn__icon" />
                  {/if}
                </svelte:fragment>
              </Button>
            </FluidForm>
          </div>
          <Code code={fluidCode} />
        </div>

        <h3 id="animated-pattern-secret">Show and hide a secret</h3>
        <p>
          The button swaps <code>View</code> and <code>ViewOff</code> each time it's pressed, and the new icon plays.
        </p>
        <div class="example">
          <div class="demo">
            <div class="demo-row form-row">
              <TextInput labelText="API key" readonly value={secretVisible ? apiKey : maskedKey} />
              <Button
                kind="ghost"
                size="field"
                iconDescription={secretVisible ? "Hide API key" : "Show API key"}
                on:click={() => {
                  secretVisible = !secretVisible;
                  secretToggles++;
                }}
              >
                <svelte:fragment slot="icon">
                  {#if secretVisible}
                    <Animated.ViewOff class="bx--btn__icon" play={secretToggles} style="margin-left: 0" />
                  {:else}
                    <Animated.View class="bx--btn__icon" play={secretToggles} style="margin-left: 0" />
                  {/if}
                </svelte:fragment>
              </Button>
            </div>
          </div>
          <Code code={secretCode} />
        </div>

        <h3 id="animated-pattern-toggles">Favorite and bookmark</h3>
        <p>
          Each button swaps to the filled icon when pressed and plays it with expressive motion. <code>aria-pressed</code> gives screen readers the state.
        </p>
        <div class="example">
          <div class="demo">
            <div class="demo-row">
              <Button
                kind="ghost"
                iconDescription={favorited ? "Remove from favorites" : "Add to favorites"}
                aria-pressed={favorited}
                on:click={() => (favorited = !favorited)}
              >
                <svelte:fragment slot="icon">
                  {#if favorited}
                    <Animated.FavoriteFilled class="bx--btn__icon" play motion="expressive" style="margin-left: 0" />
                  {:else}
                    <Animated.Favorite class="bx--btn__icon" style="margin-left: 0" />
                  {/if}
                </svelte:fragment>
              </Button>
              <Button
                kind="ghost"
                iconDescription={bookmarked ? "Remove bookmark" : "Bookmark"}
                aria-pressed={bookmarked}
                on:click={() => (bookmarked = !bookmarked)}
              >
                <svelte:fragment slot="icon">
                  {#if bookmarked}
                    <Animated.BookmarkFilled class="bx--btn__icon" play motion="expressive" style="margin-left: 0" />
                  {:else}
                    <Animated.Bookmark class="bx--btn__icon" style="margin-left: 0" />
                  {/if}
                </svelte:fragment>
              </Button>
            </div>
          </div>
          <Code code={togglesCode} />
        </div>

        <h3 id="animated-pattern-theme">Theme switch</h3>
        <p>
          This button switches the page between light and dark themes. It shows the icon for the theme it switches to.
        </p>
        <div class="example">
          <div class="demo">
            <div class="demo-row">
              <Button
                kind="ghost"
                iconDescription={dark ? "Switch to light theme" : "Switch to dark theme"}
                on:click={() => {
                  theme = dark ? "white" : "g100";
                  themeSwitches++;
                }}
              >
                <svelte:fragment slot="icon">
                  {#if dark}
                    <Animated.Sun class="bx--btn__icon" play={themeSwitches} style="margin-left: 0" />
                  {:else}
                    <Animated.Moon class="bx--btn__icon" play={themeSwitches} style="margin-left: 0" />
                  {/if}
                </svelte:fragment>
              </Button>
            </div>
          </div>
          <Code code={themeCode} />
        </div>
      </section>

      <section id="animated-defaults">
        <h2>Defaults</h2>
        <p>
          An icon passed to a component's <code>icon</code> prop can't take props of its own. Instead, call <code>setAnimatedIconDefaults</code> in a parent component to set defaults for everything inside it. Props set on an icon override the defaults. The buttons below use expressive motion with no hover delay.
        </p>
        <div class="example">
        <div class="demo">
          <AnimatedDefaults defaults={{ motion: "expressive", hoverDelay: 0 }}>
            <div class="demo-row">
              <Button kind="secondary" icon={Download}>Download</Button>
              <Button kind="ghost" icon={Notification} iconDescription="Notifications" />
              <Button kind="ghost" icon={Favorite} iconDescription="Favorite" />
              <Button kind="ghost" icon={Renew} iconDescription="Refresh" />
            </div>
          </AnimatedDefaults>
        </div>
        <Code code={defaultsCode} />
        </div>
      </section>

      <section id="animated-accessibility">
        <h2>Accessibility</h2>
        <p>
          Animated icons are hidden from screen readers by default, like the static icons. Give an icon a <code>title</code>, <code>aria-label</code> or <code>aria-labelledby</code> to make it an image with that name. Inside a button or link, label the button or link instead, for example with <code>iconDescription</code>.
        </p>
        <p>
          Tabbing to a button or link plays its icon, the same as hovering it. Clicking it doesn't.
        </p>
        <p>
          An icon's animation isn't announced. When an icon confirms a save or shows an error, announce the change too, with a notification or a live region.
        </p>
        <h3 id="animated-reduced-motion">Reduced motion</h3>
        <p>
          By default, icons don't play for users who prefer reduced motion. <code>reducedMotion</code> changes this: <code>"static"</code> plays nothing, <code>"fade"</code> dims and restores the icon without moving it, and <code>"full"</code> plays the normal animation. Use <code>"fade"</code> when an event still needs acknowledging. Use <code>"full"</code> only when the motion is needed to understand the change.
        </p>
        <Code code={reducedCode} />
      </section>

      <section id="animated-ssr">
        <h2>Server rendering</h2>
        <p>
          Animated icons work with SvelteKit and other server rendering without setup. The server renders icons at rest. Animation starts in the browser after hydration, and the reduced-motion preference is checked there each time an icon plays.
        </p>
        <p>
          Filled icons like <code>CheckmarkFilled</code> use a <code>&lt;mask&gt;</code> or <code>&lt;clipPath&gt;</code> with an id. Each icon gets its own id, so copies of the same icon don't conflict, and hydration keeps the ids from the server.
        </p>
      </section>

      <section id="animated-performance">
        <h2>Performance</h2>
        <p>
          Only the icons you import are bundled. The first animated icon adds about 1.6 kB gzipped, including the shared runtime. Each additional icon adds about 0.6 kB, mostly CSS. Importing from <code>carbon-icons-svelte/animated</code> produces the same bundle as importing each file directly, in both Vite and webpack.
        </p>
        <p>
          In development, Vite bundles <code>carbon-icons-svelte/animated</code> once. Webpack and Rollup compile every icon it exports on each build, and <code>optimizeImports</code> doesn't rewrite this path yet. With those tools, import files directly, like <code>carbon-icons-svelte/lib/animated/Notification.svelte</code>.
        </p>
        <p>
          An icon that isn't playing runs no timers, observers or animation frames. Animations last 700ms at most.
        </p>
        <p>
          Filled icons whose glyph is a hole, like <code>CheckmarkFilled</code>, include two copies of their markup: Carbon's original for rest and a masked copy for animation. They take about twice as long to mount as a static icon, about 16µs each in Chrome.
        </p>
        <p>
          Browsers animate SVG on the main thread. Twenty looping icons use about 2% of it. Loops pause while scrolled out of view.
        </p>
      </section>

      <section id="animated-props">
        <h2>Props</h2>
        <p>
          Every prop except <code>play</code> and <code>loop</code> can also be set with <code>setAnimatedIconDefaults</code>. Select an icon above to try its props.
        </p>
        <table>
          <thead>
            <tr><th>Name</th><th>Type</th><th>Default</th></tr>
          </thead>
          <tbody>
            <tr><td><code>play</code></td><td><code>boolean | number</code></td><td><code>false</code></td></tr>
            <tr><td><code>loop</code></td><td><code>boolean</code></td><td><code>false</code></td></tr>
            <tr><td><code>trigger</code></td><td><code>"hover" | "none"</code></td><td><code>"hover"</code></td></tr>
            <tr><td><code>motion</code></td><td><code>"productive" | "expressive"</code></td><td><code>"productive"</code></td></tr>
            <tr><td><code>reducedMotion</code></td><td><code>"static" | "fade" | "full"</code></td><td><code>"static"</code></td></tr>
            <tr><td><code>hoverDelay</code></td><td><code>number</code> (ms)</td><td><code>150</code></td></tr>
          </tbody>
        </table>
        <Button kind="tertiary" icon={Animated.Edit} on:click={() => (explorerOpen = true)}>Open the props explorer</Button>
      </section>

    </Prose>
  </CssColumn>
</CssGrid>
</Content>

<SidePanel
  bind:open={explorerOpen}
  titleText={name}
  size="lg"
  includeOverlay
  selectorPrimaryFocus=".bx--side-panel__close"
  class="explorer-panel"
>
  <div class="explorer">
    <div class="example">
    <div class="stage">
      <svelte:component this={Animated[name]} {size} {motion} {trigger} {reducedMotion} {hoverDelay} {play} {loop} />
      <Button kind="ghost">
        {name}
        <svelte:component
          this={Animated[name]}
          slot="icon"
          class="bx--btn__icon"
          {motion}
          {trigger}
          {reducedMotion}
          {hoverDelay}
          {play}
          {loop}
        />
      </Button>
      <div class="stage-actions">
        <Button
          kind="ghost"
          size="field"
          icon={Animated.Play}
          iconDescription="Play"
          tooltipPosition="bottom"
          on:click={() => play++}
        />
        <Button
          kind="ghost"
          size="field"
          icon={linkCopied ? Animated.Checkmark : Animated.Link}
          iconDescription={linkCopied ? "Link copied" : "Copy a link to these props"}
          tooltipPosition="bottom"
          tooltipAlignment="end"
          on:click={copyLink}
        />
      </div>
    </div>
    <Code code={explorerCode} wrapText />
    </div>
    <Layer class="controls">
      <dl class="prop-list">
        <dt>
          size <span class="unit">(px)</span>
          <TooltipIcon icon={Animated.Information} direction="top" align="start" portalTooltip>
            <span slot="tooltipText">{propInfo.size[0]}<span class="tooltip-default">Default: {propInfo.size[1]}</span></span>
          </TooltipIcon>
        </dt>
        <dd>
          <RadioButtonGroup legendText="size" hideLegend bind:selected={size}>
            <RadioButton labelText="16" value={16} />
            <RadioButton labelText="20" value={20} />
            <RadioButton labelText="24" value={24} />
            <RadioButton labelText="32" value={32} />
          </RadioButtonGroup>
        </dd>
        <dt>
          motion
          <TooltipIcon icon={Animated.Information} direction="top" align="start" portalTooltip>
            <span slot="tooltipText">{propInfo.motion[0]}<span class="tooltip-default">Default: {propInfo.motion[1]}</span></span>
          </TooltipIcon>
        </dt>
        <dd>
          <RadioButtonGroup legendText="motion" hideLegend bind:selected={motion} on:change={replayExplorer}>
            <RadioButton labelText="productive" value="productive" />
            <RadioButton labelText="expressive" value="expressive" />
          </RadioButtonGroup>
        </dd>
        <dt>
          trigger
          <TooltipIcon icon={Animated.Information} direction="top" align="start" portalTooltip>
            <span slot="tooltipText">{propInfo.trigger[0]}<span class="tooltip-default">Default: {propInfo.trigger[1]}</span></span>
          </TooltipIcon>
        </dt>
        <dd>
          <RadioButtonGroup legendText="trigger" hideLegend bind:selected={trigger}>
            <RadioButton labelText="hover" value="hover" />
            <RadioButton labelText="none" value="none" />
          </RadioButtonGroup>
        </dd>
        <dt>
          hoverDelay <span class="unit">(ms)</span>
          <TooltipIcon icon={Animated.Information} direction="top" align="start" portalTooltip>
            <span slot="tooltipText">{propInfo.hoverDelay[0]}<span class="tooltip-default">Default: {propInfo.hoverDelay[1]}</span></span>
          </TooltipIcon>
        </dt>
        <dd>
          <RadioButtonGroup legendText="hoverDelay" hideLegend disabled={trigger === "none"} bind:selected={hoverDelay}>
            <RadioButton labelText="0" value={0} />
            <RadioButton labelText="150" value={150} />
            <RadioButton labelText="300" value={300} />
            <RadioButton labelText="600" value={600} />
          </RadioButtonGroup>
        </dd>
        <dt>
          reducedMotion
          <TooltipIcon icon={Animated.Information} direction="top" align="start" portalTooltip>
            <span slot="tooltipText">{propInfo.reducedMotion[0]}<span class="tooltip-default">Default: {propInfo.reducedMotion[1]}</span></span>
          </TooltipIcon>
        </dt>
        <dd>
          <RadioButtonGroup legendText="reducedMotion" hideLegend bind:selected={reducedMotion}>
            <RadioButton labelText="static" value="static" />
            <RadioButton labelText="fade" value="fade" />
            <RadioButton labelText="full" value="full" />
          </RadioButtonGroup>
        </dd>
        <dt>
          loop
          <TooltipIcon icon={Animated.Information} direction="top" align="start" portalTooltip>
            <span slot="tooltipText">{propInfo.loop[0]}<span class="tooltip-default">Default: {propInfo.loop[1]}</span></span>
          </TooltipIcon>
        </dt>
        <dd>
          <RadioButtonGroup legendText="loop" hideLegend bind:selected={loopChoice}>
            <RadioButton labelText="false" value="false" />
            <RadioButton labelText="true" value="true" />
          </RadioButtonGroup>
        </dd>
      </dl>
    </Layer>
  </div>
</SidePanel>

<style>
  :global(html) {
    scroll-padding-top: 4rem;
  }

  section :global(.page-title) {
    font-size: 1.75rem;
    font-weight: 400;
    line-height: 1.29;
    margin: 0;
  }

  :global(.page) {
    padding-block: var(--cds-spacing-07) var(--cds-spacing-10);
  }

  section + section {
    margin-block-start: var(--cds-spacing-12);
  }

  section :global(h3) {
    margin-block-start: var(--cds-spacing-09);
  }

  .toc {
    position: sticky;
    top: 4rem;
  }

  @media (max-width: 65.98rem) {
    .toc {
      position: static;
      margin-block-end: var(--cds-spacing-09);
    }
  }

  section :global(:is(p, ul, h2)),
  section :global(.code) {
    max-width: 44rem;
  }

  .demo {
    display: flex;
    flex-direction: column;
    gap: var(--cds-spacing-05);
    padding: var(--cds-spacing-07) var(--cds-spacing-06);
    background: var(--cds-layer-01, var(--cds-ui-01));
  }

  /* A field and its button: the button lines up with the field, below the
     field's label, whatever the field's helper or error text does. */
  .demo-row.form-row {
    align-items: flex-start;
    flex-wrap: nowrap;
    gap: 1px;
  }

  .form-row :global(.bx--form-item) {
    flex: 0 1 20rem;
  }

  .form-row :global(.bx--btn) {
    flex: none;
    margin-block-start: 1.5rem;
  }

  .demo :global(.fluid-demo) {
    max-width: 24rem;
  }

  .demo :global(.fluid-demo > .bx--btn) {
    width: 100%;
    max-width: none;
  }

  .demo-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--cds-spacing-03);
  }

  .divider {
    width: 1px;
    height: 2rem;
    margin: 0 var(--cds-spacing-03);
    background: var(--cds-border-subtle-01, var(--cds-ui-03));
  }

  .motion-compare {
    align-items: flex-start;
  }

  .motion-mode {
    display: flex;
    align-items: center;
    gap: var(--cds-spacing-07);
  }

  .motion-label {
    width: 6rem;
    color: var(--cds-text-secondary, var(--cds-text-02));
  }

  .motion-icons {
    display: flex;
    gap: var(--cds-spacing-07);
  }

  .explorer {
    display: flex;
    flex-direction: column;
    gap: var(--cds-spacing-06);
  }

  /* The panel and its overlay appear and leave at once. Without an
     animation, SidePanel closes without waiting for one. */
  :global(.bx--side-panel.explorer-panel),
  :global(.bx--side-panel__overlay) {
    animation: none;
  }

  /* Between lg and xl: wide enough for the longest icon's import line. */
  :global(.bx--side-panel.explorer-panel) {
    width: min(46rem, 100%);
  }

  /* A preview and its code read as one example, like Carbon's docs: one
     frame, one width, no gap between them. */
  .example {
    border: 1px solid var(--cds-border-subtle-01, var(--cds-ui-03));
  }

  section .example :global(.code) {
    max-width: none;
  }

  .example .demo {
    background: var(--cds-background, var(--cds-ui-background));
  }

  .stage {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--cds-spacing-07);
    min-height: 6rem;
    padding: var(--cds-spacing-05) var(--cds-spacing-06);
    background: var(--cds-background, var(--cds-ui-background));
  }

  .example :global(.bx--snippet) {
    border-block-start: 1px solid var(--cds-border-subtle-01, var(--cds-ui-03));
  }

  /* Play and copy-link sit in the preview's corner, like a code block's copy button. */
  .stage {
    position: relative;
  }

  .stage-actions {
    position: absolute;
    inset-block-start: 0;
    inset-inline-end: 0;
    display: flex;
  }

  .explorer :global(.controls) {
    padding: 0 var(--cds-spacing-05);
    background: var(--cds-layer-01, var(--cds-ui-01));
  }

  /* One row per prop: its name, then its control. */
  .prop-list {
    display: grid;
    grid-template-columns: 10.5rem minmax(0, 1fr);
    margin: 0;
  }

  .prop-list dt {
    gap: var(--cds-spacing-02);
    font-size: 0.875rem;
    color: var(--cds-text-secondary, var(--cds-text-02));
  }

  .tooltip-default {
    display: block;
    margin-block-start: var(--cds-spacing-03);
  }

  .unit {
    color: var(--cds-text-helper, var(--cds-text-05));
  }

  .prop-list dt,
  .prop-list dd {
    min-height: 3.5rem;
    display: flex;
    align-items: center;
    margin: 0;
    padding-block: var(--cds-spacing-04);
    border-block-end: 1px solid var(--cds-border-subtle-01, var(--cds-ui-03));
  }

  .prop-list dt:last-of-type,
  .prop-list dd:last-of-type {
    border-block-end: 0;
  }

  .prop-list dd {
    min-width: 0;
  }

  .prop-list dd :global(.bx--form-item),
  .prop-list dd :global(.bx--slider-container) {
    flex: 1;
    min-width: 0;
    margin: 0;
  }

  /* On narrow screens each prop's name sits above its control. */
  @media (max-width: 41.98rem) {
    .prop-list {
      grid-template-columns: minmax(0, 1fr);
    }

    .prop-list dt {
      min-height: 0;
      padding-block: var(--cds-spacing-04) 0;
      border-block-end: 0;
    }

    .prop-list dd {
      min-height: 0;
      padding-block-start: var(--cds-spacing-03);
    }
  }

  .prop-list dd :global(fieldset) {
    margin: 0;
  }

  .explorer :global(.code) {
    max-width: none;
  }

  /* Each control's label, with its tooltip, on one line above the control. */
  .control-label {
    display: flex;
    align-items: center;
    gap: var(--cds-spacing-02);
    margin-block-end: var(--cds-spacing-03);
  }

  .control-label .bx--label {
    margin: 0;
  }

  /* The table of contents sits on the right on wide screens, and stays
     above the content on narrow ones. */
  @media (min-width: 66rem) {
    :global(.toc-column) {
      order: 2;
    }
  }

  .gallery-search {
    max-width: 44rem;
    margin-block-end: var(--cds-spacing-07);
  }

  .gallery-motion-row {
    display: flex;
    align-items: center;
    gap: var(--cds-spacing-02);
  }

  /* A category heading sits closer to its own tiles than to the grid above. */
  .gallery {
    margin-block-start: var(--cds-spacing-05);
  }

  /* Nested links line up with their parent's text, past its icon. */
  .toc :global(.bx--toc__item--nested .bx--toc__link) {
    padding-inline-start: calc(1rem + 16px + var(--cds-spacing-03));
  }

  .toc-count {
    font-size: 0.75rem;
    color: var(--cds-text-helper, var(--cds-text-05));
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  .gallery-empty {
    margin-block-start: var(--cds-spacing-07);
    color: var(--cds-text-secondary, var(--cds-text-02));
  }

  .gallery-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: var(--cds-spacing-07);
  }

  .gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
    gap: 1px;
  }

  @media (max-width: 41.98rem) {
    .gallery {
      grid-template-columns: repeat(auto-fill, minmax(6rem, 1fr));
    }
  }

  /* Square tiles, with room for the icon at 32px, so changing the size or a
     long name never changes a tile's shape. */
  .gallery button {
    aspect-ratio: 1;
    display: grid;
    grid-template-rows: 1fr auto;
    justify-items: center;
    align-items: center;
    gap: var(--cds-spacing-03);
    padding: var(--cds-spacing-05) var(--cds-spacing-03) var(--cds-spacing-04);
    background: var(--cds-layer-01, var(--cds-ui-01));
    border: 0;
    color: var(--cds-text-primary, var(--cds-text-01));
    cursor: pointer;
  }

  .gallery button:hover {
    background: var(--cds-layer-hover-01, var(--cds-hover-ui));
  }

  .gallery button:focus {
    outline: 2px solid var(--cds-focus);
    outline-offset: -2px;
  }

  .tile-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
  }

  .tile-name {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
    max-width: 100%;
    min-height: 2lh;
    text-align: center;
    font-size: 0.75rem;
    line-height: 1rem;
    color: var(--cds-text-secondary, var(--cds-text-02));
  }
</style>
