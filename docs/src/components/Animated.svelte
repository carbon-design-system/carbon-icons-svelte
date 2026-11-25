<script>
  import {
    Button,
    Content,
    ContentSwitcher,
    Dropdown,
    FluidForm,
    CssColumn,
    EmptyState,
    CssGrid,
    Layer,
    Link,
    OverflowMenu,
    OverflowMenuItem,
    Prose,
    Popover,
    RadioButton,
    RadioButtonGroup,
    SidePanel,
    Switch,
    Search as SearchInput,
    Tab,
    TabContent,
    TableOfContents,
    TableOfContentsItem,
    Tabs,
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
  import { pageLinks } from "../page-links.js";
  import Code from "./Code.svelte";
  import { fitToolbar, revealResults, rovingFocus, watchStuck } from "../gallery.js";
  import FocusKey from "./FocusKey.svelte";
  import { ANIMATED_ALIASES } from "../generated/animated-aliases";
  import { indexAliases, matchingTerm, normalize, rankAliases, rankName } from "../search.js";

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
    ["animated-recipes", "Recipes", "Idea"],
    ["animated-defaults", "Shared defaults", "Settings"],
    ["animated-accessibility", "Accessibility", "ViewOff"],
    ["animated-ssr", "Server rendering", "Terminal"],
    ["animated-performance", "Performance", "Dashboard"],
    ["animated-props", "Props", "Edit"],
  ];


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

  // The reduced motion demo plays as if the user prefers reduced motion.
  // Icons check the preference with matchMedia as they start, so it only
  // needs to answer "reduce" during that one play.
  let reducedPlay = 0;
  let simulatingReduced = false;
  const playReduced = async () => {
    simulatingReduced = true;
    reducedPlay++;
    await tick();
    simulatingReduced = false;
  };
  onMount(() => {
    const matchMedia = window.matchMedia;
    window.matchMedia = (query) =>
      simulatingReduced && query === "(prefers-reduced-motion: reduce)"
        ? { ...matchMedia.call(window, query), matches: true }
        : matchMedia.call(window, query);
    return () => (window.matchMedia = matchMedia);
  });

  // Each recipe tab has its own link, like #animated-recipes-fluid-form.
  const recipes = [
    ["toolbar", "Toolbar"],
    ["form-submission", "Form submission"],
    ["fluid-form", "Fluid form"],
    ["show-secret", "Show secret"],
    ["favorite", "Favorite"],
    ["theme-switch", "Theme switch"],
  ];
  const RECIPE_HASH = "#animated-recipes-";
  let recipeIndex = 0;

  const selectRecipeFromHash = () => {
    if (!location.hash.startsWith(RECIPE_HASH)) return false;
    const index = recipes.findIndex(([slug]) => RECIPE_HASH + slug === location.hash);
    if (index === -1) return false;
    recipeIndex = index;
    return true;
  };

  const linkRecipe = ({ detail: index }) => {
    const hash = RECIPE_HASH + recipes[index][0];
    if (location.hash !== hash) history.replaceState(history.state, "", hash);
  };

  // The page mounts after the browser has looked for the URL's target, so
  // scroll to it here. Sections skipped by content-visibility take their
  // real size as they come into view, which moves the target, so scroll
  // again each frame until it stays put.
  const scrollToHash = async () => {
    const id = selectRecipeFromHash() ? "animated-recipes" : decodeURIComponent(location.hash.slice(1));
    const target = id ? document.getElementById(id) : null;
    if (!target) return;
    let top;
    for (let frame = 0; frame < 10; frame++) {
      target.scrollIntoView({ behavior: "instant" });
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
      const next = target.getBoundingClientRect().top;
      if (next === top) return;
      top = next;
    }
  };
  onMount(() => {
    tick().then(scrollToHash);
  });

  let name = "Notification";
  let explorerOpen = false;

  const explore = (option) => {
    name = option;
    size = iconSize;
    explorerOpen = true;
  };

  // j and k step through the gallery as shown, search and Loop included.
  $: browseOrder = visibleGroups.flatMap((group) => group.names);
  $: browseIndex = browseOrder.indexOf(name);
  const step = (delta) => {
    const next = browseOrder[browseIndex + delta];
    if (browseIndex === -1 || !next) return;
    name = next;
  };
  // Keep the gallery behind the panel on the icon shown, and focus its tile
  // when the panel closes, after SidePanel returns focus to the opener.
  const tileOf = (option) => groupsElement?.querySelector(`button[data-icon="${option}"]`);
  $: if (explorerOpen && name) tileOf(name)?.scrollIntoView({ block: "nearest" });
  let wasOpen = false;
  $: {
    if (wasOpen && !explorerOpen) requestAnimationFrame(() => tileOf(name)?.focus({ preventScroll: true }));
    wasOpen = explorerOpen;
  }
  /** @param {KeyboardEvent} event */
  const onPanelKeydown = (event) => {
    if (!explorerOpen || event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
    const target = event.target;
    if (target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))) return;
    if (event.key === "j") step(1);
    else if (event.key === "k") step(-1);
    else return;
    event.preventDefault();
  };
  let motion = "productive";
  let trigger = "hover";
  let reducedMotion = "static";
  let hoverDelay = 150;
  let size = 16;
  let play = 0;
  let loopChoice = "false";
  $: loop = loopChoice === "true";

  // Where the explorer shows the icon: on its own, or in a Carbon button.
  const previews = [
    ["icon", "Icon"],
    ["button", "Button"],
    ["icon-button", "Icon button"],
  ];
  let previewIndex = 0;
  $: preview = previews[previewIndex][0];

  // The open panel and its non-default props live in the URL's query, so a
  // link reopens the explorer as it was. The hash stays the page route.
  const PROP_DEFAULTS = { preview: "icon", size: 16, motion: "productive", trigger: "hover", reducedMotion: "static", hoverDelay: 150, loop: "false" };
  const oneOf = (value, options, fallback) => (options.includes(value) ? value : fallback);
  const iconSizes = [16, 20, 24, 32];

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
      previewIndex = Math.max(0, previews.findIndex(([id]) => id === params.get("preview")));
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

  $: query = explorerQuery(explorerOpen, { name, preview, size, motion, trigger, reducedMotion, hoverDelay, loop: loopChoice });
  $: permalink = typeof location === "undefined" ? "" : `${location.origin}/animated${query}`;
  $: if (urlReady && query !== location.search) {
    history.replaceState(history.state, "", `${location.pathname}${query}${location.hash}`);
  }
  let galleryMotionIndex = 0;

  let optionsOpen = false;

  // The toolbar shows its bottom border only while stuck under the header.
  // A zero-height element just above it leaves the viewport, below the
  // 48px header, exactly when the toolbar sticks.
  let toolbarStuck = false;

  // When the controls don't fit on one row next to the search, they move
  // into a popover. Whether they fit depends on their content (a theme like
  // "Gray 100" is wider than "White"), so it's measured, not a breakpoint.
  let compactToolbar = typeof matchMedia !== "undefined" && matchMedia("(max-width: 81.98rem)").matches;
  const setCompact = (compact) => {
    compactToolbar = compact;
    if (!compact) optionsOpen = false;
  };

  // The header's side nav lists this page's sections on narrow screens.
  onMount(() => {
    pageLinks.set(
      sections.flatMap(([id, text]) => [
        { href: `#${id}`, text },
        ...(id === "animated-icons" ? groups.map((group) => ({ href: `#${group.id}`, text: group.title, nested: true })) : []),
      ])
    );
    return () => pageLinks.set([]);
  });


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

  // Narrowing the gallery while scrolled into it would leave the results
  // above the viewport, so bring their start back under the toolbar, or
  // under the header when the toolbar isn't sticky.
  let toolbarElement = null;
  let groupsElement = null;
  let emptyElement = null;
  let lastFilter;
  // The empty state's icon plays once it has settled in, rather than while
  // it pops in under the cursor. Back to 0 when it goes, so it doesn't play
  // straight away the next time it mounts. In a function, so only
  // `noResults` reruns it, not the timer and count it sets.
  let emptyPlay = 0;
  let emptyTimer;
  const scheduleEmptyPlay = (empty) => {
    clearTimeout(emptyTimer);
    if (empty) emptyTimer = setTimeout(() => emptyPlay++, 400);
    else emptyPlay = 0;
  };
  $: noResults = visibleGroups.length === 0;
  $: scheduleEmptyPlay(noResults);

  const clearSearch = () => {
    galleryQuery = "";
    galleryInput?.focus();
  };
  const revealGallery = async () => {
    await tick();
    revealResults(emptyElement ?? groupsElement, toolbarElement, !compactToolbar);
  };
  /** The search field, which "/" and Cmd+K focus. */
  let galleryInput = null;
  let galleryPlay = 0;
  let galleryLoop = false;

  // The icons that loop. The components don't expose it, so it's listed here.
  const looping = new Set(["CircleDash", "Hourglass", "InProgress", "Incomplete", "Pending", "PendingFilled", "Renew", "RenewAlt", "Restart", "Reset", "Repeat", "Recycle", "Settings", "Terminal", "Time", "TimeFilled", "Timer"]);

  // Carbon's search terms for each icon, so "heart" finds Favorite.
  const aliasIndex = indexAliases(ANIMATED_ALIASES);
  // The keyword an icon matched by, when its name didn't match, shown on
  // its tile so the result makes sense.
  const matchedBy = (query, name) =>
    query && rankName(query, name) < 0 ? matchingTerm(query, ANIMATED_ALIASES[name]) : undefined;

  // A name match first, then a search term. See `rankName`.
  const rankFor = (query, name) => {
    const byName = rankName(query, name);
    return byName >= 0 ? byName : rankAliases(query, aliasIndex.get(name));
  };
  $: queryKey = normalize(galleryQuery);
  $: {
    const filter = `${queryKey}|${galleryLoop}`;
    if (lastFilter !== undefined && filter !== lastFilter) revealGallery();
    lastFilter = filter;
  }
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

  $: visibleGroups = groups
    .map((group) => ({
      ...group,
      names: group.names.filter((option) => (!galleryLoop || looping.has(option)) && (!queryKey || rankFor(queryKey, option) >= 0))
        .sort((a, b) => (queryKey ? rankFor(queryKey, a) - rankFor(queryKey, b) : 0)),
    }))
    .filter((group) => group.names.length > 0);

  // Shared with the icon list's theme select.
  const themes = ["white", "g10", "g80", "g90", "g100"];
  const themeNames = { white: "White", g10: "Gray 10", g80: "Gray 80", g90: "Gray 90", g100: "Gray 100" };
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

  // Props that differ from their defaults. In a button, the icon takes the
  // button's size, so `size` is left out.
  $: explorerProps = [
    preview === "icon" && size !== 16 && `size={${size}}`,
    motion !== "productive" && `motion="${motion}"`,
    trigger !== "hover" && `trigger="${trigger}"`,
    reducedMotion !== "static" && `reducedMotion="${reducedMotion}"`,
    hoverDelay !== 150 && `hoverDelay={${hoverDelay}}`,
    trigger === "none" && "play={count}",
    loop && "loop={loading}",
  ].filter(Boolean);

  // A tag stays on one line if it fits Prettier's default 80 columns, which
  // the panel shows without scrolling; otherwise one prop per line.
  const tag = (open, props, indent = "") => {
    const line = `${indent}<${open}${props.map((prop) => ` ${prop}`).join("")} />`;
    return line.length <= 80 ? line : `${indent}<${open}\n${props.map((prop) => `${indent}  ${prop}`).join("\n")}\n${indent}/>`;
  };

  const plays = (trigger) => trigger === "none";

  $: explorerMarkup =
    preview === "icon"
      ? `${plays(trigger) ? "<button on:click={() => count++}>Play</button>\n\n" : ""}${tag(name, explorerProps)}`
      : [
          `<Button${preview === "icon-button" ? ` kind="ghost" iconDescription="${name}"` : ""}${plays(trigger) ? " on:click={() => count++}" : ""}>`,
          ...(preview === "button" ? [`  ${name}`] : []),
          tag(name, ['slot="icon"', 'class="bx--btn__icon"', ...explorerProps], "  "),
          "</Button>",
        ].join("\n");

  $: explorerCode = `<script>${preview === "icon" ? "" : '\n  import { Button } from "carbon-components-svelte";'}
  import { ${name} } from "carbon-icons-svelte/animated";${plays(trigger) ? "\n\n  let count = 0;" : ""}
<\/script>

${explorerMarkup}`;

  const importCode = `<script>
  import { Notification } from "carbon-icons-svelte/animated";
<\/script>

<Notification />`;

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
  import { Checkmark, CheckmarkFilled, Copy, Download, InProgress } from "carbon-icons-svelte/animated";

  let status = "idle"; // "idle" | "active" | "done"
  let copied = false;

  async function download() {
    status = "active";
    await save(); // your request
    status = "done";
    setTimeout(() => (status = "idle"), 2000);
  }

  function copy() {
    copied = true;
    setTimeout(() => (copied = false), 2000);
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
</Button>

<Button kind="ghost" iconDescription={copied ? "Copied" : "Copy"} on:click={copy}>
  <svelte:fragment slot="icon">
    {#key copied}
      <svelte:component this={copied ? Checkmark : Copy} class="bx--btn__icon" play={copied} />
    {/key}
  </svelte:fragment>
</Button>`;

  const reducedCode = `<Checkmark play={saved} trigger="none" reducedMotion="fade" />`;
</script>

<svelte:window on:hashchange={scrollToHash} on:keydown={onPanelKeydown} />

<FocusKey element={galleryInput} selectText />

<Content>

<!-- Gallery toolbar controls, shared by the full and compact toolbars. -->
{#snippet searchControl(size)}
  <SearchInput {size} labelText="Search animated icons" placeholder="Search {names.length} icons" shortcut="mod+k" selectTextOnFocus bind:ref={galleryInput} bind:value={galleryQuery} />
{/snippet}

{#snippet motionControl(labelledBy)}
  <ContentSwitcher size="sm" autoWidth lowContrast aria-label={labelledBy ? undefined : "Motion"} aria-labelledby={labelledBy} bind:selectedIndex={galleryMotionIndex} on:change={replayGallery}>
    <Switch text="Productive" />
    <Switch text="Expressive" />
  </ContentSwitcher>
{/snippet}

{#snippet sizeControl(labelledBy)}
  <ContentSwitcher
    size="sm"
    autoWidth
    lowContrast
    aria-label={labelledBy ? undefined : "Icon size"}
    aria-labelledby={labelledBy}
    selectedIndex={Math.max(0, iconSizes.indexOf(iconSize))}
    on:change={({ detail }) => (iconSize = iconSizes[detail])}
  >
    {#each iconSizes as option (option)}
      <Switch text="{option}" />
    {/each}
  </ContentSwitcher>
{/snippet}

{#snippet themeControl(id)}
  <div class="toolbar-theme">
    <span id={id} class="bx--label">Theme</span>
    <Dropdown
      type="inline"
      size="sm"
      titleText="Theme"
      hideLabel
      aria-labelledby={id}
      items={themes.map((option) => ({ id: option, text: themeNames[option] }))}
      selectedId={theme}
      on:select={({ detail }) => (theme = detail.selectedId)}
    />
  </div>
{/snippet}

{#snippet playControl()}
  <Button kind="ghost" size="small" icon={Animated.Play} iconDescription="Play all" tooltipPosition="bottom" tooltipAlignment="end" on:click={() => galleryPlay++} />
{/snippet}

<!-- Full width, with the table of contents narrowing to 3 columns on wide
     screens, so the gallery gets the extra room. -->
<CssGrid class="page docs-page" fullWidth>
  <CssColumn sm={4} md={8} lg={4} xlg={3} class="toc-column">
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
                <span class="toc-count">({group.names.length})</span>
              </TableOfContentsItem>
            {/each}
          {/if}
        {/each}
      </TableOfContents>
    </div>
    <!-- On narrow screens the table of contents is hidden, and its links are in the header's menu. -->
  </CssColumn>

  <CssColumn sm={4} md={8} lg={12} xlg={13}>
    <Prose maxWidth="none">
      <section id="animated-icons">
        <!-- The page's only h1, sized like the other sections so the gallery starts high. -->
        <h1 class="page-title">Animated icons</h1>
        <p class="page-description">Carbon icons that animate on hover, keyboard focus or when you play them.</p>
        <Theme bind:theme persist persistKey="theme" />
        <!-- One toolbar row, every control 32px, sticky while scrolling the gallery. -->
        <div class="toolbar-sentinel" use:watchStuck={(stuck) => (toolbarStuck = stuck && !compactToolbar)}></div>
        <div
          class="gallery-toolbar"
          class:stuck={toolbarStuck}
          class:compact={compactToolbar}
          use:fitToolbar={{ compact: compactToolbar, set: setCompact }}
          bind:this={toolbarElement}
        >
          {@render searchControl("sm")}
          {#if compactToolbar}
            <!-- Where the controls don't fit on one row: search, play, and the rest in a popover. -->
            {@render playControl()}
            <div class="toolbar-options">
              <Button
                kind="ghost"
                size="small"
                icon={Animated.Settings}
                iconDescription="View options"
                tooltipPosition="bottom"
                tooltipAlignment="end"
                aria-expanded={optionsOpen}
                on:click={() => (optionsOpen = !optionsOpen)}
              />
              <Popover bind:open={optionsOpen} align="bottom-right" caret closeOnOutsideClick closeOnEscape>
                <div class="options-panel">
                  <div class="options-field">
                    <span id="compact-motion-label" class="bx--label">Motion</span>
                    {@render motionControl("compact-motion-label")}
                  </div>
                  <div class="options-field">
                    <span id="compact-size-label" class="bx--label">Size</span>
                    {@render sizeControl("compact-size-label")}
                  </div>
                  {@render themeControl("compact-theme-label")}
                  <div class="toolbar-field">
                    <span id="compact-loop-label" class="bx--label">Loop</span>
                    <Toggle size="sm" labelText="Loop" hideLabel labelA="" labelB="" aria-labelledby="compact-loop-label" bind:toggled={galleryLoop} />
                  </div>
                </div>
              </Popover>
            </div>
          {:else}
          <div class="toolbar-controls">
            <div class="toolbar-field">
              <span id="toolbar-motion-label" class="bx--label">Motion</span>
              {@render motionControl("toolbar-motion-label")}
            </div>
            <div class="toolbar-field">
              <span id="toolbar-size-label" class="bx--label">Size</span>
              {@render sizeControl("toolbar-size-label")}
            </div>
            {@render themeControl("toolbar-theme-label")}
            <div class="toolbar-field">
              <span id="toolbar-loop-label" class="bx--label">Loop</span>
              <Toggle size="sm" labelText="Loop" hideLabel labelA="" labelB="" aria-labelledby="toolbar-loop-label" bind:toggled={galleryLoop} />
            </div>
            {@render playControl()}
          </div>
          {/if}
        </div>
        {#if visibleGroups.length === 0}
          <div class="gallery-empty" bind:this={emptyElement}>
            <EmptyState size="sm" headingLevel={3} titleText="No icons match “{galleryQuery.trim()}”" subtitleText="Try a keyword like “heart” or “refresh”.">
              <Animated.Idea slot="illustration" size={32} play={emptyPlay} trigger="none" motion="expressive" />
              <Button kind="tertiary" size="small" on:click={clearSearch}>Clear search</Button>
            </EmptyState>
          </div>
        {/if}
        <p class="visually-hidden" aria-live="polite">{searchStatus}</p>
        <p id="gallery-keys" class="visually-hidden">Use the arrow keys to move between icons.</p>
        <div class="gallery-groups" bind:this={groupsElement} role="group" aria-label="Animated icons" aria-describedby="gallery-keys" use:rovingFocus={visibleGroups}>
        {#each visibleGroups as group (group.id)}
          <h3 id={group.id}>{group.title}</h3>
          <div class="gallery">
            {#each group.names as option (option)}
              {@const term = matchedBy(queryKey, option)}
              <button type="button" data-icon={option} on:click={() => explore(option)}>
                {#if term}<span class="tile-match" aria-hidden="true">{term}</span>{/if}
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
            <strong>Animate for meaning.</strong> Animate an icon only when its motion shows what it does, like a bell ringing or an arrow moving the way it points. Logos and nouns stay static.
          </li>
          <li>
            <strong>Match the motion to the moment.</strong>
            <ul>
              <li><strong>Productive</strong> for routine UI, like toolbars, menus and navigation.</li>
              <li><strong>Expressive</strong> for events people should notice, like a save or a new message, triggered with <code>play</code>.</li>
            </ul>
          </li>
          <li>
            <strong>Loop only while work runs.</strong> Progress, refresh and waiting icons loop until the work finishes. Everything else plays once.
          </li>
          <li>
            <strong>Keep the hover delay,</strong> unless the pointer is meant to rest on a single control, like one call to action.
          </li>
          <li>
            <strong>Keep text labels.</strong> Icon-only buttons still need an <code>iconDescription</code>, and state changes still need to be announced. See <a href="#animated-accessibility">Accessibility</a>.
          </li>
        </ul>
      </section>

      <section id="animated-motion">
        <h2>Motion</h2>
        <p><code>motion</code> picks one of Carbon's two motion styles, with Carbon's durations and easings:</p>
        <ul>
          <li><strong>Productive</strong> (<code>"productive"</code>, the default): one short move, 400ms or less.</li>
          <li><strong>Expressive</strong> (<code>"expressive"</code>): up to 700ms, with secondary motion and overshoot.</li>
        </ul>
        <div class="example">
          <div class="demo-bar">
            <span class="demo-bar-label">Preview</span>
            <Button kind="ghost" size="small" icon={Animated.Play} on:click={() => motionPlay++}>Play</Button>
          </div>
          <div class="demo motion-compare">
            {#each ["productive", "expressive"] as mode (mode)}
              <div class="motion-mode">
                <span class="motion-label">{mode === "productive" ? "Productive" : "Expressive"}</span>
                <span class="motion-icons">
                  {#each motionIcons as Icon}
                    <Icon motion={mode} trigger="none" play={motionPlay} />
                  {/each}
                </span>
              </div>
            {/each}
          </div>
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
        <div class="demo-bar">
          <span class="demo-bar-label">Preview</span>
          <Button kind="ghost" size="small" on:click={() => unread++}>Simulate a notification</Button>
        </div>
        <div class="demo">
          <div class="demo-row">
            <Button on:click={() => saved++}>
              Save
              <Checkmark slot="icon" class="bx--btn__icon" play={saved} trigger="none" motion="expressive" />
            </Button>
            <Button kind="ghost" iconDescription="Notifications ({unread} unread)">
              <Notification slot="icon" class="bx--btn__icon" play={unread} trigger="none" motion="expressive" />
            </Button>
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
        <div class="demo-bar">
          <span class="demo-bar-label">Preview</span>
          <Toggle size="sm" labelText="Simulate loading" hideLabel labelA="Simulate loading" labelB="Simulate loading" bind:toggled={loading} />
        </div>
        <div class="demo">
          <div class="demo-row">
            <Button kind="tertiary" disabled={refreshing} on:click={refresh}>
              Refresh
              <Renew slot="icon" class="bx--btn__icon" loop={refreshing} />
            </Button>
          </div>
          <div class="demo-row">
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
        <p>
          To replay an icon whenever a value changes, wrap it in <code>{"{#key value}"}</code>. Svelte mounts the icon again, so it plays again. The copy button uses one <code>{"{#key}"}</code> block for both its icons.
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
                {#key copied}
                  <svelte:component this={copied ? Checkmark : Copy} class="bx--btn__icon" play={copied} style="margin-left: 0" />
                {/key}
              </svelte:fragment>
            </Button>
          </div>
        </div>
        <Code code={statesCode} />
        </div>
      </section>

      <section id="animated-recipes">
        <h2>Recipes</h2>
        <p>Common patterns, built with Carbon components.</p>
        <Tabs type="container" class="recipes" autoWidth bind:selected={recipeIndex} on:change={linkRecipe}>
          {#each recipes as [slug, label] (slug)}
            <Tab {label} href="{RECIPE_HASH}{slug}" />
          {/each}
          <svelte:fragment slot="content">
            <TabContent lazy>
              <div class="recipe">
            <p>
              Icon-only buttons in a toolbar. Moving the pointer across the toolbar plays nothing. Resting it on a button plays that button's icon.
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
              </div>
            </TabContent>
            <TabContent lazy>
              <div class="recipe">
            <p>
              The button's icon shows the result. An invalid email shakes the error icon, again on every failed attempt. A valid one plays the check.
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
              </div>
            </TabContent>
            <TabContent lazy>
              <div class="recipe">
            <p>
              The submit button's icon follows the request: a send icon before submitting, a progress icon that loops while the request runs, then a check. An invalid email shakes an error icon instead.
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
              </div>
            </TabContent>
            <TabContent lazy>
              <div class="recipe">
            <p>
              Each press swaps the show and hide icons, and the new icon plays.
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
              </div>
            </TabContent>
            <TabContent lazy>
              <div class="recipe">
            <p>
              Pressing a button swaps in the filled icon and plays it with expressive motion. The button's pressed state tells screen readers whether it's on.
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
              </div>
            </TabContent>
            <TabContent lazy>
              <div class="recipe">
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
              </div>
            </TabContent>
          </svelte:fragment>
        </Tabs>
      </section>

      <section id="animated-defaults">
        <h2>Shared defaults</h2>
        <p>
          Call <code>setAnimatedIconDefaults</code> in a parent component to set props for every animated icon inside it. In your root layout, that's the whole app. It's also how to set props on an icon passed to a component's <code>icon</code> prop, which can't take props of its own.
        </p>
        <p>Props set on an icon override the defaults. The buttons below use expressive motion with no hover delay.</p>
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
          Screen readers don't see animation, so an animated icon needs the same text as a static one. Motion also needs care for people who find it distracting.
        </p>
        <ul>
          <li>
            <strong>Labels.</strong> An icon is hidden from screen readers unless it has a <code>title</code>, <code>aria-label</code> or <code>aria-labelledby</code>. In a button or link, label the button or link instead, for example with <code>iconDescription</code>.
          </li>
          <li>
            <strong>Keyboard.</strong> Focusing a button or link with the keyboard plays its icon, like hovering does. Clicking doesn't.
          </li>
          <li>
            <strong>Announcements.</strong> If an icon confirms a save or shows an error, say so in text too, with a notification or a live region.
          </li>
        </ul>
        <h3 id="animated-reduced-motion">Reduced motion</h3>
        <p>By default, icons don't play for users who prefer reduced motion. <code>reducedMotion</code> changes this:</p>
        <ul>
          <li><strong>Static</strong> (<code>"static"</code>, the default): nothing plays.</li>
          <li><strong>Fade</strong> (<code>"fade"</code>): the icon dims and comes back, without moving. Use it for events people still need to notice.</li>
          <li><strong>Full</strong> (<code>"full"</code>): the icon plays as usual. Use it only when the change can't be understood without the motion.</li>
        </ul>
        <div class="example">
          <div class="demo-bar">
            <span class="demo-bar-label">Preview, as if reduced motion is on</span>
            <Button kind="ghost" size="small" icon={Animated.Play} on:click={playReduced}>Play</Button>
          </div>
          <div class="demo motion-compare">
            {#each [["static", "Static"], ["fade", "Fade"], ["full", "Full"]] as [mode, label] (mode)}
              <div class="motion-mode">
                <span class="motion-label">{label}</span>
                <span class="motion-icons">
                  {#each motionIcons as Icon}
                    <Icon reducedMotion={mode} trigger="none" play={reducedPlay} />
                  {/each}
                </span>
              </div>
            {/each}
          </div>
          <Code code={reducedCode} />
        </div>
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
        <ul>
          <li>
            <strong>Bundle size.</strong> Only the icons you import are bundled.
            <ul>
              <li><strong>First icon:</strong> about 1.6 kB gzipped, including the shared runtime.</li>
              <li><strong>Each icon after that:</strong> about 0.6 kB, mostly CSS.</li>
              <li><strong>Importing from <code>carbon-icons-svelte/animated</code></strong> produces the same bundle as importing each file directly, in both Vite and webpack.</li>
            </ul>
          </li>
          <li>
            <strong>Development builds.</strong>
            <ul>
              <li><strong>Vite</strong> bundles <code>carbon-icons-svelte/animated</code> once.</li>
              <li><strong>Webpack and Rollup</strong> compile every icon it exports on each build, and <code>optimizeImports</code> doesn't rewrite this path yet. Import files directly instead, like <code>carbon-icons-svelte/lib/animated/Notification.svelte</code>.</li>
            </ul>
          </li>
          <li>
            <strong>Nothing runs at rest.</strong> An icon that isn't playing runs no timers, observers or animation frames. Animations last 700ms at most.
          </li>
          <li>
            <strong>Filled icons mount twice the markup.</strong> Icons whose glyph is a hole, like <code>CheckmarkFilled</code>, include Carbon's original for rest and a masked copy for animation. They take about twice as long to mount as a static icon, about 16µs each in Chrome.
          </li>
          <li>
            <strong>Loops use the main thread.</strong> Browsers animate SVG there. Twenty looping icons use about 2% of it, and loops pause while scrolled out of view.
          </li>
        </ul>
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
  class="explorer-panel docs-panel"
>
  <div slot="toolbar" class="browse">
    <Button
      kind="ghost"
      size="small"
      icon={Animated.ChevronLeft}
      iconDescription="Previous (K)"
      tooltipPosition="bottom"
      tooltipAlignment="start"
      disabled={browseIndex <= 0}
      on:click={() => step(-1)}
    />
    <Button
      kind="ghost"
      size="small"
      icon={Animated.ChevronRight}
      iconDescription="Next (J)"
      tooltipPosition="bottom"
      disabled={browseIndex === -1 || browseIndex >= browseOrder.length - 1}
      on:click={() => step(1)}
    />
    {#if browseIndex !== -1}
      <span class="browse-position">{browseIndex + 1} of {browseOrder.length}</span>
    {/if}
  </div>
  <div class="explorer">
    <div class="example">
    <div class="preview-bar">
      <Tabs type="container" size="md" autoWidth bind:selected={previewIndex}>
        {#each previews as [id, label] (id)}
          <Tab {label} />
        {/each}
      </Tabs>
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
          iconDescription={linkCopied ? "Copied!" : "Copy URL"}
          tooltipPosition="bottom"
          tooltipAlignment="end"
          on:click={copyLink}
        />
      </div>
    </div>
    <div class="stage">
      {#if preview === "icon"}
        <svelte:component this={Animated[name]} {size} {motion} {trigger} {reducedMotion} {hoverDelay} {play} {loop} />
      {:else if preview === "button"}
        <Button on:click={() => trigger === "none" && play++}>
          {name}
          <svelte:component this={Animated[name]} slot="icon" class="bx--btn__icon" {motion} {trigger} {reducedMotion} {hoverDelay} {play} {loop} />
        </Button>
      {:else}
        <!-- No default slot content, so Button lays it out as icon-only. -->
        <Button kind="ghost" iconDescription={name} on:click={() => trigger === "none" && play++}>
          <svelte:component this={Animated[name]} slot="icon" class="bx--btn__icon" {motion} {trigger} {reducedMotion} {hoverDelay} {play} {loop} />
        </Button>
      {/if}
    </div>
    <Code code={explorerCode} wrapText />
    </div>
    <Layer class="controls">
      <dl class="prop-list">
        <!-- In a button, the icon takes the button's size. -->
        {#if preview === "icon"}
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
        {/if}
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
