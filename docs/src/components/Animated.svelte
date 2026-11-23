<script>
  import {
    Button,
    CodeSnippet,
    Column,
    Content,
    Grid,
    Link,
    ListItem,
    OverflowMenu,
    OverflowMenuItem,
    RadioButton,
    RadioButtonGroup,
    Row,
    Select,
    SelectItem,
    Slider,
    Tile,
    Toggle,
    UnorderedList,
  } from "carbon-components-svelte";
  import * as Animated from "carbon-icons-svelte/animated";
  import {
    Add,
    ArrowRight,
    Checkmark,
    ChevronLeft,
    ChevronRight,
    Copy,
    Download,
    Edit,
    Favorite,
    Notification,
    PageFirst,
    PageLast,
    Renew,
    Search,
    Settings,
    TrashCan,
  } from "carbon-icons-svelte/animated";
  import AnimatedDefaults from "./AnimatedDefaults.svelte";

  const names = Object.keys(Animated)
    .filter((name) => name !== "setAnimatedIconDefaults")
    .sort();

  // Play on an event.
  let saved = 0;
  let unread = 0;

  // Props explorer.
  let name = "Notification";
  let motion = "productive";
  let trigger = "hover";
  let reducedMotion = "static";
  let hoverDelay = 150;
  let size = 32;
  let play = 0;
  let expressiveGallery = false;

  $: explorerProps = [
    size !== 16 && `size={${size}}`,
    motion !== "productive" && `motion="${motion}"`,
    trigger !== "hover" && `trigger="${trigger}"`,
    reducedMotion !== "static" && `reducedMotion="${reducedMotion}"`,
    hoverDelay !== 150 && `hoverDelay={${hoverDelay}}`,
    trigger === "none" && "play={count}",
  ].filter(Boolean);

  $: explorerCode = `<script>
  import { ${name} } from "carbon-icons-svelte/animated";${trigger === "none" ? "\n\n  let count = 0;" : ""}
<\/script>
${trigger === "none" ? '\n<button on:click={() => count++}>Play</button>\n' : ""}
<${name}${explorerProps.length ? " " + explorerProps.join(" ") : ""} />`;

  const componentsCode = `<script>
  import { Button, Link, OverflowMenu } from "carbon-components-svelte";
  import { Add, ArrowRight, Notification, Settings } from "carbon-icons-svelte/animated";
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

<!-- Use the "icon" slot to pass props. -->
<Button on:click={() => saved++}>
  Save
  <Checkmark slot="icon" class="bx--btn__icon" aria-hidden="true"
    play={saved} trigger="none" motion="expressive" />
</Button>`;

  const defaultsCode = `<script>
  import { setAnimatedIconDefaults } from "carbon-icons-svelte/animated";

  // Applies to every animated icon in this component and its children,
  // including ones passed to an \`icon\` prop. Props on an icon still win.
  setAnimatedIconDefaults({ motion: "expressive", hoverDelay: 0 });
<\/script>`;
</script>

<Content>
  <Grid>
    <Row padding>
      <Column lg={10}>
        <h1 class="heading">Animated icons</h1>
        <p class="lead">
          {names.length} icons have animated versions in <code>carbon-icons-svelte/animated</code>. They take the same
          props as the static icons. By default, an icon plays when a mouse rests on it, or on the button or link
          around it, or when that gets keyboard focus. Motion uses Carbon's durations and easings, and respects the
          user's reduced-motion setting.
        </p>
        <CodeSnippet type="multi" code={`import { Notification } from "carbon-icons-svelte/animated";`} />
      </Column>
    </Row>

    <Row padding>
      <Column>
        <h2 class="subheading">In Carbon components</h2>
        <p class="body">
          Pass an animated icon wherever a component takes an <code>icon</code>. Hover or tab to each one.
        </p>
        <div class="demo">
          <Button icon={Add}>Add item</Button>
          <Button kind="secondary" icon={Download}>Download</Button>
          <Button kind="tertiary" icon={Renew}>Refresh</Button>
          <Button kind="ghost" icon={Edit}>Edit</Button>
          <Button kind="danger" icon={TrashCan}>Delete</Button>
        </div>
        <div class="demo">
          <Button kind="ghost" icon={Notification} iconDescription="Notifications" />
          <Button kind="ghost" icon={Search} iconDescription="Search" />
          <Button kind="ghost" icon={Favorite} iconDescription="Favorite" />
          <Button kind="ghost" icon={Copy} iconDescription="Copy" />
          <Button kind="ghost" icon={Settings} iconDescription="Settings" />
          <span class="divider" />
          <Button kind="ghost" size="small" icon={PageFirst} iconDescription="First page" />
          <Button kind="ghost" size="small" icon={ChevronLeft} iconDescription="Previous page" />
          <Button kind="ghost" size="small" icon={ChevronRight} iconDescription="Next page" />
          <Button kind="ghost" size="small" icon={PageLast} iconDescription="Last page" />
          <span class="divider" />
          <Link href="#animated" icon={ArrowRight}>Learn more</Link>
          <OverflowMenu icon={Settings}>
            <OverflowMenuItem text="Rename" />
            <OverflowMenuItem text="Duplicate" />
          </OverflowMenu>
        </div>
        <CodeSnippet type="multi" code={componentsCode} />
      </Column>
    </Row>

    <Row padding>
      <Column>
        <h2 class="subheading">Play on an event</h2>
        <p class="body">
          For a moment that matters, like a save or a new notification, play the icon from your own state with
          <code>play</code>, and use <code>motion="expressive"</code>. Increment a number to replay. Carbon's
          <code>Button</code> passes props to an icon in its <code>icon</code> slot.
        </p>
        <div class="demo">
          <Button on:click={() => saved++}>
            Save
            <Checkmark slot="icon" class="bx--btn__icon" aria-hidden="true" play={saved} trigger="none" motion="expressive" />
          </Button>
          <Button kind="ghost" iconDescription="Notifications ({unread} unread)">
            <Notification slot="icon" class="bx--btn__icon" aria-hidden="true" play={unread} trigger="none" motion="expressive" />
          </Button>
          <Button kind="tertiary" size="small" on:click={() => unread++}>Simulate a notification</Button>
        </div>
        <CodeSnippet type="multi" code={eventCode} />
      </Column>
    </Row>

    <Row padding>
      <Column>
        <h2 class="subheading">Defaults for a whole area</h2>
        <p class="body">
          An icon passed to an <code>icon</code> prop can't take props. Set defaults with
          <code>setAnimatedIconDefaults</code> in a parent component instead. These buttons are expressive and play
          with no hover delay.
        </p>
        <AnimatedDefaults defaults={{ motion: "expressive", hoverDelay: 0 }}>
          <div class="demo">
            <Button kind="secondary" icon={Download}>Download</Button>
            <Button kind="ghost" icon={Notification} iconDescription="Notifications" />
            <Button kind="ghost" icon={Favorite} iconDescription="Favorite" />
            <Button kind="ghost" icon={Renew} iconDescription="Refresh" />
          </div>
        </AnimatedDefaults>
        <CodeSnippet type="multi" code={defaultsCode} />
      </Column>
    </Row>

    <Row padding>
      <Column>
        <h2 class="subheading">Props</h2>
        <Tile class="explorer">
          <div class="controls">
            <Select labelText="Icon" bind:selected={name}>
              {#each names as option (option)}
                <SelectItem value={option} />
              {/each}
            </Select>
            <Select labelText="size" bind:selected={size}>
              {#each [16, 20, 24, 32, 64] as option (option)}
                <SelectItem value={option} />
              {/each}
            </Select>
            <RadioButtonGroup legendText="motion" bind:selected={motion}>
              <RadioButton labelText="productive" value="productive" />
              <RadioButton labelText="expressive" value="expressive" />
            </RadioButtonGroup>
            <RadioButtonGroup legendText="trigger" bind:selected={trigger}>
              <RadioButton labelText="hover" value="hover" />
              <RadioButton labelText="none" value="none" />
            </RadioButtonGroup>
            <Select labelText="reducedMotion" bind:selected={reducedMotion} helperText="What plays if the user prefers reduced motion">
              <SelectItem value="static" />
              <SelectItem value="fade" />
              <SelectItem value="full" />
            </Select>
            <Slider labelText="hoverDelay (ms)" min={0} max={600} step={10} bind:value={hoverDelay} disabled={trigger === "none"} />
          </div>
          <div class="preview">
            <svelte:component this={Animated[name]} {size} {motion} {trigger} {reducedMotion} {hoverDelay} {play} />
            <Button kind="tertiary" size="small" on:click={() => play++}>Play</Button>
          </div>
          <CodeSnippet type="multi" code={explorerCode} />
        </Tile>
      </Column>
    </Row>

    <Row padding>
      <Column>
        <h2 class="subheading">All animated icons</h2>
        <Toggle labelText="Motion" labelA="Productive" labelB="Expressive" bind:toggled={expressiveGallery} />
        <div class="gallery">
          {#each names as option (option)}
            <button type="button" title={option} on:click={() => (name = option)}>
              <svelte:component this={Animated[option]} size={32} motion={expressiveGallery ? "expressive" : "productive"} />
              <span>{option}</span>
            </button>
          {/each}
        </div>
      </Column>
    </Row>

    <Row padding>
      <Column lg={10}>
        <h2 class="subheading">Guidance</h2>
        <UnorderedList>
          <ListItem>
            <strong>Animate for meaning.</strong> Motion should say what the icon does: the bell rings, the arrow moves
            the way it points. Most icons, like logos and nouns, stay static.
          </ListItem>
          <ListItem>
            <strong>Productive for routine UI, expressive for moments that matter.</strong> Toolbars, menus and
            navigation stay productive, the default. Save confirmations, new notifications and errors can be
            expressive, played with <code>play</code>.
          </ListItem>
          <ListItem>
            <strong>Don't loop.</strong> Each animation plays once and ends where it started. Replay it on the next
            event instead.
          </ListItem>
          <ListItem>
            <strong>Keep the hover delay.</strong> It stops a toolbar from rippling as the pointer crosses it. Lower it
            only where the pointer is expected to rest, like a single call to action.
          </ListItem>
          <ListItem>
            <strong>Respect reduced motion.</strong> By default, nothing plays for users who prefer reduced motion. Use
            <code>reducedMotion="fade"</code> to still acknowledge an event without movement. Use
            <code>reducedMotion="full"</code> only when the motion itself is essential to understanding the change.
          </ListItem>
          <ListItem>
            <strong>Keep a label.</strong> Animation doesn't replace text: icon-only buttons still need
            <code>iconDescription</code>, and state changes still need to be announced.
          </ListItem>
        </UnorderedList>
      </Column>
    </Row>
  </Grid>
</Content>

<style>
  .heading {
    margin-bottom: var(--cds-spacing-05);
  }

  .lead {
    margin-bottom: var(--cds-spacing-06);
    max-width: 60ch;
  }

  .subheading {
    font-size: var(--cds-productive-heading-03-font-size, 1.25rem);
    margin-bottom: var(--cds-spacing-03);
  }

  .body {
    max-width: 70ch;
    margin-bottom: var(--cds-spacing-05);
    color: var(--cds-text-02);
  }

  .demo {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--cds-spacing-03);
    margin-bottom: var(--cds-spacing-05);
  }

  .divider {
    width: 1px;
    height: 2rem;
    margin: 0 var(--cds-spacing-03);
    background: var(--cds-ui-03);
  }

  :global(.explorer) {
    display: grid;
    gap: var(--cds-spacing-06);
  }

  .controls {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
    gap: var(--cds-spacing-06);
    align-items: start;
  }

  .preview {
    display: flex;
    align-items: center;
    gap: var(--cds-spacing-07);
    min-height: 6rem;
    padding: var(--cds-spacing-06);
    background: var(--cds-ui-background);
  }

  .gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
    gap: var(--cds-spacing-02);
    margin-top: var(--cds-spacing-05);
  }

  .gallery button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--cds-spacing-03);
    padding: var(--cds-spacing-05) var(--cds-spacing-03);
    background: var(--cds-ui-01);
    border: 0;
    color: var(--cds-text-01);
    cursor: pointer;
  }

  .gallery button:hover {
    background: var(--cds-hover-ui);
  }

  .gallery button:focus {
    outline: 2px solid var(--cds-focus);
    outline-offset: -2px;
  }

  .gallery span {
    max-width: 100%;
    overflow-wrap: anywhere;
    text-align: center;
    font-size: var(--cds-label-01-font-size, 0.75rem);
    color: var(--cds-text-02);
  }
</style>
