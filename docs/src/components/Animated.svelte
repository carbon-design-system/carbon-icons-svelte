<script>
  import {
    Button,
    Content,
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
    Select,
    SelectItem,
    Slider,
    TableOfContents,
    TableOfContentsItem,
    Toggle,
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
  import AnimatedDefaults from "./AnimatedDefaults.svelte";
  import Code from "./Code.svelte";

  const names = Object.keys(Animated)
    .filter((name) => name !== "setAnimatedIconDefaults")
    .sort();

  const groups = [
    { id: "animated-actions", title: "Actions", names: ["Add", "Close", "Subtract", "Edit", "EditOff", "Copy", "TrashCan", "Download", "Upload", "CloudDownload", "CloudUpload", "Launch", "Send", "Search", "Settings"] },
    {
      id: "animated-status",
      title: "Status",
      names: [
        "Checkmark",
        "CheckmarkOutline",
        "CheckmarkFilled",
        "Warning",
        "WarningFilled",
        "WarningSquareFilled",
        "WarningAlt",
        "WarningAltFilled",
        "WarningAltInvertedFilled",
        "Error",
        "ErrorFilled",
        "Information",
        "InformationFilled",
        "InformationSquareFilled",
      ],
    },
    {
      id: "animated-feedback",
      title: "Feedback",
      names: [
        "Notification",
        "Favorite",
        "FavoriteFilled",
        "Star",
        "StarFilled",
        "Locked",
        "Unlocked",
        "View",
        "ViewOff",
        "Light",
        "Location",
        "Pin",
        "PinFilled",
        "Time",
        "Wifi",
        "WifiOff",
        "VolumeUp",
        "VolumeDown",
        "MicrophoneOff",
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
      names: ["CircleDash", "InProgress", "Incomplete", "Pending", "PendingFilled"],
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

  const sections = [
    ["animated-icons", "Icons"],
    ["animated-overview", "Usage"],
    ["animated-carbon", "In Carbon components"],
    ["animated-events", "Play on an event"],
    ["animated-loop", "Loop"],
    ["animated-states", "Icons for each state"],
    ["animated-defaults", "Defaults"],
    ["animated-motion", "Motion"],
    ["animated-reduced-motion", "Reduced motion"],
    ["animated-props", "Props"],
    ["animated-guidance", "Guidance"],
  ];

  const sizeMarks = [16, 20, 24, 32].map((value) => ({ value, label: `${value}` }));
  const delayMarks = [0, 150, 300, 450, 600].map((value) => ({ value, label: `${value}` }));

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
  let motion = "productive";
  let trigger = "hover";
  let reducedMotion = "static";
  let hoverDelay = 150;
  let size = 16;
  let play = 0;
  let loop = false;
  let expressiveGallery = false;
  let gallerySize = 16;

  $: explorerProps = [
    size !== 16 && `size={${size}}`,
    motion !== "productive" && `motion="${motion}"`,
    trigger !== "hover" && `trigger="${trigger}"`,
    reducedMotion !== "static" && `reducedMotion="${reducedMotion}"`,
    hoverDelay !== 150 && `hoverDelay={${hoverDelay}}`,
    trigger === "none" && "play={count}",
    loop && "loop={loading}",
  ].filter(Boolean);

  $: explorerCode = `<script>
  import { ${name} } from "carbon-icons-svelte/animated";${trigger === "none" ? "\n\n  let count = 0;" : ""}
<\/script>
${trigger === "none" ? '\n<button on:click={() => count++}>Play</button>\n' : ""}
<${name}${explorerProps.length ? " " + explorerProps.join(" ") : ""} />`;

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
      <TableOfContents labelText="On this page" scrollOffset={64}>
        {#each sections as [id, text] (id)}
          <TableOfContentsItem href="#{id}" {text} />
          {#if id === "animated-icons"}
            {#each groups as group (group.id)}
              <TableOfContentsItem href="#{group.id}" text={group.title} level={2} />
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
          Hover an icon to play it, or select one to try it in the <a href="#animated-props">props explorer</a>. Parts
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
            bind:value={gallerySize}
          />
        </div>
        {#each groups as group (group.id)}
          <h3 id={group.id}>{group.title}</h3>
          <div class="gallery">
            {#each group.names as option (option)}
              <button
                type="button"
                title={option}
                on:click={() => {
                  name = option;
                  location.hash = "animated-props";
                }}
              >
                <svelte:component this={Animated[option]} size={gallerySize} motion={expressiveGallery ? "expressive" : "productive"} />
                <span>{option}</span>
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

      <section id="animated-carbon">
        <h2>In Carbon components</h2>
        <p>Pass an animated icon wherever a component takes an <code>icon</code>. Hover or tab to each one.</p>
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
      </section>

      <section id="animated-events">
        <h2>Play on an event</h2>
        <p>
          For a moment that matters, like a save or a new notification, play the icon from your own state with
          <code>play</code>. It plays each time <code>play</code> changes to a truthy value, so increment a number to
          replay it. To pass props to an icon in a <code>Button</code>, put it in the <code>icon</code> slot with the
          <code>bx--btn__icon</code> class that <code>Button</code> gives its own icons.
        </p>
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
      </section>

      <section id="animated-loop">
        <h2>Loop</h2>
        <p>
          Progress and refresh icons can loop with <code>loop</code>. While it's <code>true</code>, the icon repeats a
          cycle that starts and ends at rest; when it turns <code>false</code>, the current cycle finishes and the icon
          stops at rest instead of snapping. Hover and <code>play</code> don't interrupt a loop. Loop only while
          something is in progress.
        </p>
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
      </section>

      <section id="animated-defaults">
        <h2>Defaults</h2>
        <p>
          An icon passed to an <code>icon</code> prop can't take props. Set defaults for a whole area with
          <code>setAnimatedIconDefaults</code> in a parent component instead. Props on an icon still win. These buttons
          are expressive and play without a hover delay.
        </p>
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

      <section id="animated-reduced-motion">
        <h2>Reduced motion</h2>
        <p>
          By default, nothing plays for users who prefer reduced motion. <code>reducedMotion</code> changes what they
          see: <code>"static"</code> plays nothing, <code>"fade"</code> dims the icon and brings it back without moving
          it, and <code>"full"</code> plays the full motion anyway. Use <code>"fade"</code> to still acknowledge an
          event, and <code>"full"</code> only when the motion itself is essential to understanding the change.
        </p>
        <Code code={reducedCode} />
      </section>

      <section id="animated-props">
        <h2>Props</h2>
        <p>
          Every prop except <code>play</code> and <code>loop</code> can also be set with
          <code>setAnimatedIconDefaults</code>. Try them below.
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
        <div class="explorer">
          <div class="stage">
            <div class="stage-icons">
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
            </div>
            <div class="stage-footer">
              <span class="stage-hint">
                {trigger === "hover" ? "Hover the icon or the button, or tab to the button." : "Plays only from Play."}
              </span>
              <Button kind="tertiary" size="small" on:click={() => play++}>Play</Button>
            </div>
          </div>
          <Layer class="controls">
            <Select labelText="Icon" bind:selected={name}>
              {#each names as option (option)}
                <SelectItem value={option} />
              {/each}
            </Select>
            <Slider
              labelText="size"
              min={16}
              max={32}
              marks={sizeMarks}
              snapToMarks
              hideTextInput
              hideRangeLabels
              fullWidth
              formatValue={(value) => `${value}px`}
              bind:value={size}
            />
            <RadioButtonGroup legendText="motion" bind:selected={motion}>
              <RadioButton labelText="productive" value="productive" />
              <RadioButton labelText="expressive" value="expressive" />
            </RadioButtonGroup>
            <RadioButtonGroup legendText="trigger" bind:selected={trigger}>
              <RadioButton labelText="hover" value="hover" />
              <RadioButton labelText="none" value="none" />
            </RadioButtonGroup>
            <Select labelText="reducedMotion" bind:selected={reducedMotion}>
              <SelectItem value="static" />
              <SelectItem value="fade" />
              <SelectItem value="full" />
            </Select>
            <Toggle labelText="loop" labelA="false" labelB="true" bind:toggled={loop} />
            <Slider
              labelText="hoverDelay (ms)"
              min={0}
              max={600}
              step={10}
              marks={delayMarks}
              hideRangeLabels
              fullWidth
              bind:value={hoverDelay}
              disabled={trigger === "none"}
            />
          </Layer>
          <div class="explorer-code">
            <Code code={explorerCode} />
          </div>
        </div>
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
            <strong>Loop only progress.</strong> Each animation plays once and ends where it started; replay it on the
            next event. Loop only progress and refresh icons, and only while something is in progress.
          </li>
          <li>
            <strong>Keep the hover delay.</strong> It stops a toolbar from rippling as the pointer crosses it. Lower it
            only where the pointer is expected to rest, like a single call to action.
          </li>
          <li>
            <strong>Keep a label.</strong> Animation doesn't replace text: icon-only buttons still need
            <code>iconDescription</code>, and state changes still need to be announced.
          </li>
        </ul>
      </section>
    </Prose>
  </CssColumn>
</CssGrid>
</Content>

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
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(18rem, 22rem);
    grid-template-areas:
      "stage controls"
      "code code";
    gap: var(--cds-spacing-05);
  }

  .stage {
    grid-area: stage;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--cds-spacing-07);
    min-height: 20rem;
    padding: var(--cds-spacing-06);
    border: 1px solid var(--cds-border-subtle-01, var(--cds-ui-03));
  }

  .stage-icons {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--cds-spacing-07);
  }

  .stage-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--cds-spacing-05);
  }

  .stage-hint {
    font-size: 0.875rem;
    color: var(--cds-text-secondary, var(--cds-text-02));
  }

  .explorer :global(.controls) {
    grid-area: controls;
    display: flex;
    flex-direction: column;
    gap: var(--cds-spacing-07);
    padding: var(--cds-spacing-06);
    background: var(--cds-layer-01, var(--cds-ui-01));
  }

  .explorer-code {
    grid-area: code;
  }

  .explorer-code :global(.code) {
    max-width: none;
  }

  @media (max-width: 41.98rem) {
    .explorer {
      grid-template-columns: minmax(0, 1fr);
      grid-template-areas:
        "stage"
        "controls"
        "code";
    }

    .stage {
      min-height: 14rem;
    }
  }

  .gallery-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: var(--cds-spacing-09);
  }

  .gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(8.5rem, 1fr));
    gap: 1px;
  }

  .gallery button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--cds-spacing-03);
    padding: var(--cds-spacing-05) var(--cds-spacing-03);
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

  .gallery span {
    max-width: 100%;
    overflow-wrap: anywhere;
    text-align: center;
    font-size: 0.75rem;
    color: var(--cds-text-secondary, var(--cds-text-02));
  }
</style>
