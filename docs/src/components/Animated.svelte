<script>
  import {
    Button,
    Content,
    CopyButton,
    CssColumn,
    CssGrid,
    Layer,
    Link,
    OverflowMenu,
    OverflowMenuItem,
    PageHeader,
    Prose,
    RadioButton,
    RadioButtonGroup,
    SidePanel,
    Slider,
    TableOfContents,
    TableOfContentsItem,
    Tag,
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
  import { onMount } from "svelte";
  import AnimatedDefaults from "./AnimatedDefaults.svelte";
  import Code from "./Code.svelte";

  const names = Object.keys(Animated)
    .filter((name) => name !== "setAnimatedIconDefaults")
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
    ["animated-icons", "Icons", "Star"],
    ["animated-overview", "Usage", "Code"],
    ["animated-guidance", "Guidance", "Information"],
    ["animated-motion", "Motion", "Activity"],
    ["animated-carbon", "In Carbon components", "Add"],
    ["animated-events", "Play on an event", "Play"],
    ["animated-loop", "Loop", "Renew"],
    ["animated-states", "Icons for each state", "CheckmarkOutline"],
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

  /** What each prop in the explorer does, and its default, for its tooltip. */
  const propInfo = {
    size: ["The icon's width and height. Carbon's scale is 16, 20, 24 and 32.", "16"],
    motion: ["productive is one short, subtle move, for routine UI. expressive is larger and livelier, for moments that matter.", "productive"],
    trigger: ["hover plays when the pointer rests on the icon, or the button or link around it, or when that gets keyboard focus. none plays only from play.", "hover"],
    hoverDelay: ["How long the pointer has to rest before the icon plays, so sweeping across a toolbar plays nothing.", "150"],
    reducedMotion: ["What users who prefer reduced motion see. static plays nothing, fade dims the icon and brings it back, full plays the motion anyway.", "static"],
    loop: ["Repeats the animation while true, for progress. When it turns false, the current cycle finishes. Only progress, refresh and waiting icons loop.", "false"],
  };
  const hoverDelays = [0, 150, 300, 600];
  let urlReady = false;

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
  let expressiveGallery = false;
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
<PageHeader
  grid
  title="Animated icons"
  subtitle="{names.length} icons that move with Carbon's motion, for routine UI and moments that matter."
/>

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
                <Tag size="sm" type="cool-gray">{group.names.length}</Tag>
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
        <h2>Icons</h2>
        <p>
          Hover an icon to play it, or select one to try its props. Parts
          move on their own where it means something, like the bell and its clapper; arrows nudge the way they point.
        </p>
        <div class="gallery-controls">
          <Toggle labelText="Motion" labelA="Productive" labelB="Expressive" bind:toggled={expressiveGallery} />
          <Slider
            labelText="Size"
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
        {#each groups as group (group.id)}
          <h3 id={group.id}>{group.title}</h3>
          <div class="gallery">
            {#each group.names as option (option)}
              <button type="button" title={option} on:click={() => explore(option)}>
                <span class="tile-icon">
                  <svelte:component this={Animated[option]} size={iconSize} motion={expressiveGallery ? "expressive" : "productive"} />
                </span>
                <span class="tile-name">
                  {#each option.split(/(?=[A-Z_])/) as word, i}{#if i}<wbr />{/if}{word}{/each}
                </span>
              </button>
            {/each}
          </div>
        {/each}
      </section>

      <section id="animated-overview">
        <h2>Usage</h2>
        <p>
          Import animated icons from <code>carbon-icons-svelte/animated</code>, or one at a time from
          <code>carbon-icons-svelte/lib/animated/Notification.svelte</code>. They take the same props as the static
          icons. An icon plays when a mouse rests on it, or on the button or link around it, or when that gets keyboard
          focus. Sweeping the pointer across a toolbar plays nothing, and once an animation starts, it runs to the end.
        </p>
        <Code code={importCode} />
      </section>

      <section id="animated-guidance">
        <h2>Guidance</h2>
        <ul>
          <li>
            <strong>Animate for meaning.</strong> Motion should say what the icon does: the bell rings, the arrow moves
            the way it points. Most icons, like logos and nouns, stay static.
          </li>
          <li>
            <strong>Productive for routine UI, expressive for moments that matter.</strong> Toolbars, menus and
            navigation stay productive. Save confirmations, new notifications and errors can be expressive, played with
            <code>play</code>.
          </li>
          <li>
            <strong>Loop only while something is in progress.</strong> Each animation plays once and ends where it
            started; replay it on the next event. Loop only progress, refresh and waiting icons, and only while the work
            runs.
          </li>
          <li>
            <strong>Keep the hover delay.</strong> It stops a toolbar from rippling as the pointer crosses it. Lower it
            only where the pointer is expected to rest, like a single call to action.
          </li>
          <li>
            <strong>Keep a label.</strong> Animation doesn't replace text: icon-only buttons still need
            <code>iconDescription</code>, and state changes still need to be announced. See
            <a href="#animated-accessibility">Accessibility</a>.
          </li>
        </ul>
      </section>

      <section id="animated-motion">
        <h2>Motion</h2>
        <p>
          <code>motion</code> picks one of Carbon's two motion styles, using Carbon's durations and easings.
          <code>"productive"</code>, the default, is one short move in 400ms or less, for routine UI like toolbars and
          menus. <code>"expressive"</code> adds secondary motion and overshoot in 700ms or less, for moments that
          matter.
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
          For a moment that matters, like a save or a new notification, play the icon from your own state with
          <code>play</code>. It plays each time <code>play</code> changes to a truthy value, so increment a number to
          replay it. To pass props to an icon in a <code>Button</code>, put it in the <code>icon</code> slot with the
          <code>bx--btn__icon</code> class that <code>Button</code> gives its own icons.
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
          Progress, refresh and waiting icons can loop with <code>loop</code>. While it's <code>true</code>, the icon repeats a
          cycle that starts and ends at rest; when it turns <code>false</code>, the current cycle finishes and the icon
          stops at rest instead of snapping. Hover and <code>play</code> don't interrupt a loop, and a loop pauses while the icon is scrolled out of view. Loop only while
          something is in progress.
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
          A button can show a different animated icon for each state. Swap them in an <code>{"{#if}"}</code> inside
          <code>&lt;svelte:fragment slot="icon"&gt;</code>, since a slot can't be set inside a block. Each icon plays
          the way that state needs: <code>Download</code> on hover while idle, <code>InProgress</code> on a
          <code>loop</code> while working, and <code>CheckmarkFilled</code> once with <code>play</code> as it appears,
          since an icon that mounts with a truthy <code>play</code> plays right away. The icon has the
          <code>bx--btn__icon</code> class that <code>Button</code> gives its own icons, for its spacing and color.
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

      <section id="animated-defaults">
        <h2>Defaults</h2>
        <p>
          An icon passed to an <code>icon</code> prop can't take props. Set defaults for a whole area with
          <code>setAnimatedIconDefaults</code> in a parent component instead. Props on an icon still win. These buttons
          are expressive and play without a hover delay.
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
        <ul>
          <li>
            <strong>Icons are hidden from screen readers unless labelled.</strong> Like the static icons, an animated
            icon gets <code>aria-hidden</code> unless it has a <code>title</code>, <code>aria-label</code> or
            <code>aria-labelledby</code>, which make it an image with that name. In a button or link, label the button
            or link instead: give icon-only buttons an <code>iconDescription</code>.
          </li>
          <li>
            <strong>Keyboard focus plays the icon.</strong> Tabbing to a button or link plays its icon, as resting a
            mouse on it does, so keyboard users see the same motion. Focus that comes from a click doesn't.
          </li>
          <li>
            <strong>Motion never carries the message.</strong> An icon that plays to confirm a save or flag an error
            doesn't announce anything. Announce the change too, with a notification or a live region.
          </li>
        </ul>
        <h3 id="animated-reduced-motion">Reduced motion</h3>
        <p>
          By default, nothing plays for users who prefer reduced motion. <code>reducedMotion</code> changes what they
          see: <code>"static"</code> plays nothing, <code>"fade"</code> dims the icon and brings it back without moving
          it, and <code>"full"</code> plays the full motion anyway. Use <code>"fade"</code> to still acknowledge an
          event, and <code>"full"</code> only when the motion itself is essential to understanding the change.
        </p>
        <Code code={reducedCode} />
      </section>

      <section id="animated-ssr">
        <h2>Server rendering</h2>
        <p>
          Animated icons work with SvelteKit and other server rendering with no setup. The server renders each icon at
          rest, and motion starts in the browser once the page hydrates. Whether the user prefers reduced motion is
          checked in the browser each time an icon plays, so server and browser never disagree.
        </p>
        <p>
          Filled icons, like <code>CheckmarkFilled</code>, draw their moving part through a <code>&lt;mask&gt;</code>
          or <code>&lt;clipPath&gt;</code> with an id. Each icon on a page gets its own id, so several copies of the
          same icon don't share one, and hydration keeps the ids the server rendered.
        </p>
      </section>

      <section id="animated-performance">
        <h2>Performance</h2>
        <ul>
          <li>
            <strong>You ship only the icons you import.</strong> The first animated icon adds about 1.6 kB gzipped,
            including the runtime they share, and each one after that about 0.6 kB, mostly its CSS. Importing from
            <code>carbon-icons-svelte/animated</code> tree-shakes to the same bundle as a direct import in Vite and
            webpack.
          </li>
          <li>
            <strong>Import directly for faster dev builds outside Vite.</strong> Vite pre-bundles the barrel once, but
            webpack and Rollup compile every animated icon it lists on each dev build, and
            <code>optimizeImports</code> doesn't rewrite <code>carbon-icons-svelte/animated</code> yet. Import
            <code>carbon-icons-svelte/lib/animated/Notification.svelte</code> there instead.
          </li>
          <li>
            <strong>Icons at rest cost nothing.</strong> No timers, observers or animation frames run until an icon
            plays, and an animation lasts 700ms at most. The hover delay keeps a sweep across a toolbar from playing
            every icon in it.
          </li>
          <li>
            <strong>Filled icons render twice.</strong> An icon whose glyph is a hole, like
            <code>CheckmarkFilled</code>, keeps Carbon's own markup for rest and a masked copy for playing, so it
            mounts at about twice the cost of a static icon. That's about 16µs each in Chrome.
          </li>
          <li>
            <strong>Loops take main-thread time.</strong> Browsers animate SVG on the main thread: 20 looping icons
            take about 2% of it. A loop pauses while its icon is scrolled out of view, but keep loops to what's
            actually in progress.
          </li>
        </ul>
      </section>

      <section id="animated-props">
        <h2>Props</h2>
        <p>
          Every prop except <code>play</code> and <code>loop</code> can also be set with
          <code>setAnimatedIconDefaults</code>. Select any icon above to try them on it.
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

<SidePanel bind:open={explorerOpen} titleText={name} size="lg" includeOverlay class="explorer-panel">
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
        <Button kind="tertiary" size="field" on:click={() => play++}>Play</Button>
        <CopyButton text={permalink} iconDescription="Copy a link to these props" feedback="Link copied" />
      </div>
    </div>
    <Code code={explorerCode} />
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
          <RadioButtonGroup legendText="motion" hideLegend bind:selected={motion}>
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

  /* Long lines, like a long icon's import on a phone, wrap instead of
     scrolling. */
  .example :global(.bx--snippet pre) {
    white-space: pre-wrap;
    overflow-wrap: break-word;
  }

  .stage-actions {
    display: flex;
    align-items: center;
    gap: var(--cds-spacing-03);
    margin-inline-start: auto;
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

  .gallery-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: var(--cds-spacing-09);
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
