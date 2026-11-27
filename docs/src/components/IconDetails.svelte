<script>
  /**
   * The Icons page's details panel, loaded the first time it opens (and
   * prefetched once the page is idle), so its components stay out of the
   * page's first download. The page owns the state; this renders it.
   */
  import {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    ContentSwitcher,
    IconIndicator,
    Layer,
    Link,
    SidePanel,
    Switch,
    Tab,
    Tabs,
    Tag,
    TextInput,
    TooltipIcon,
  } from "carbon-components-svelte";
  import Checkmark from "carbon-icons-svelte/lib/Checkmark.svelte";
  import Copy from "carbon-icons-svelte/lib/Copy.svelte";
  import Download from "carbon-icons-svelte/lib/Download.svelte";
  import Information from "carbon-icons-svelte/lib/Information.svelte";
  import Pin from "carbon-icons-svelte/lib/Pin.svelte";
  import PinFilled from "carbon-icons-svelte/lib/PinFilled.svelte";
  import AnimatedCheckmark from "carbon-icons-svelte/lib/animated/Checkmark.svelte";
  import AnimatedChevronLeft from "carbon-icons-svelte/lib/animated/ChevronLeft.svelte";
  import AnimatedChevronRight from "carbon-icons-svelte/lib/animated/ChevronRight.svelte";
  import AnimatedLink from "carbon-icons-svelte/lib/animated/Link.svelte";
  import Code from "./Code.svelte";
  import PixelGrid from "./PixelGrid.svelte";
  import ThemeMatrix from "./ThemeMatrix.svelte";

  export let aliasTerms;
  export let animatedNames;
  export let browseIndex;
  export let browseOrder;
  export let canonicalToAliases;
  export let categoryId;
  export let categoryOf;
  export let colors;
  export let compared;
  export let copyPanelSvg;
  export let copyUrl;
  export let cost;
  export let data;
  export let detailsCode;
  export let downloadSvg;
  export let goToGroup;
  export let iconSizes;
  export let importStyle;
  export let inButton;
  export let nameHtml;
  export let panelSvgCopied;
  export let preview;
  export let previews;
  export let reasonParts;
  export let selected;
  export let showIcon;
  export let sized;
  export let standalone;
  export let step;
  export let subcategoryOrCategoryId;
  export let svgOf;
  export let svgs;
  export let toggleCompare;
  export let urlCopied;
  export let variants;
  // Bound: the page keeps these in the URL.
  export let detailsOpen;
  export let previewIndex;
  export let importIndex;
  export let iconTitle;
  export let colorToken;
  export let iconSize;
</script>
<SidePanel
  bind:open={detailsOpen}
  titleText={selected ?? ""}
  size="lg"
  includeOverlay
  selectorPrimaryFocus=".bx--side-panel__close"
  class="explorer-panel docs-panel"
>
  <div slot="toolbar" class="browse">
    <Button
      kind="ghost"
      size="small"
      icon={AnimatedChevronLeft}
      iconDescription="Previous"
      shortcut="k"
      tooltipPosition="bottom"
      tooltipAlignment="start"
      disabled={browseIndex <= 0}
      on:click={() => step(-1)}
    />
    <Button
      kind="ghost"
      size="small"
      icon={AnimatedChevronRight}
      iconDescription="Next"
      shortcut="j"
      tooltipPosition="bottom"
      disabled={browseIndex === -1 || browseIndex >= browseOrder.length - 1}
      on:click={() => step(1)}
    />
    {#if browseIndex !== -1}
      <span class="browse-position">{(browseIndex + 1).toLocaleString()} of {browseOrder.length.toLocaleString()}</span>
    {/if}
  </div>
  {#if selected && svgs[selected]}
    {@const svg = svgs[selected]}
    <div class="explorer">
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
              icon={compared.includes(selected) ? PinFilled : Pin}
              iconDescription={compared.includes(selected) ? "Unpin from compare" : "Pin to compare"}
              tooltipPosition="bottom"
              on:click={() => toggleCompare(selected)}
            />
            <Button
              kind="ghost"
              size="field"
              icon={panelSvgCopied ? Checkmark : Copy}
              iconDescription={panelSvgCopied ? "Copied!" : "Copy SVG"}
              tooltipPosition="bottom"
              on:click={copyPanelSvg}
            />
            <Button
              kind="ghost"
              size="field"
              icon={Download}
              iconDescription="Download SVG"
              tooltipPosition="bottom"
              on:click={async () => downloadSvg(selected, await svgOf(selected))}
            />
            <Button
              kind="ghost"
              size="field"
              icon={urlCopied ? AnimatedCheckmark : AnimatedLink}
              iconDescription={urlCopied ? "Copied!" : "Copy URL"}
              tooltipPosition="bottom"
              tooltipAlignment="end"
              on:click={copyUrl}
            />
          </div>
        </div>
      <div class="example">
        <div class="stage stage-static">
          {#if preview === "icon"}
            <!-- Every size at once; picking one sets the size in the code. -->
            <div class="size-strip" role="group" aria-label="Size" style:color="var({colorToken})">
              {#each iconSizes as option (option)}
                <button type="button" class="size-option" aria-pressed={iconSize === option} on:click={() => (iconSize = option)}>
                  {@html sized(svg, option)}
                  <span>{option}</span>
                </button>
              {/each}
            </div>
          {:else if preview === "themes"}
            <ThemeMatrix {svg} token={colorToken} size={iconSize} />
          {:else if preview === "pixels"}
            <PixelGrid {svg} />
          {:else if preview === "button"}
            <Button>
              {selected}
              <svelte:fragment slot="icon">{@html inButton(svg)}</svelte:fragment>
            </Button>
          {:else}
            <Button kind="ghost" iconDescription={selected}>
              <svelte:fragment slot="icon">{@html inButton(svg)}</svelte:fragment>
            </Button>
          {/if}
        </div>
        <Code code={detailsCode} />
      </div>
      <Layer class="controls">
        <dl class="prop-list">
          {#if data.deprecated?.[selected] !== undefined}
            <dt>Status</dt>
            <dd class="status text-value">
              <IconIndicator kind="caution-minor" label="Deprecated" />
              <!-- Icons the reason names are links that open them here. -->
              <p>
                {#each reasonParts(data.deprecated[selected] || "Carbon no longer recommends this icon") as part, i (i)}
                  {#if part.icon}<Link href="?icon={part.icon}" on:click={(event) => { event.preventDefault(); showIcon(part.icon); }}>{part.icon}</Link>{:else}{part.text}{/if}
                {/each}
              </p>
            </dd>
          {/if}
          {#if standalone}
            <dt>
              title
              <TooltipIcon icon={Information} direction="top" align="start" portalTooltip>
                <span slot="tooltipText">
                  Without a title, screen readers skip the icon, which suits an icon beside text that says the same. With
                  one, it's an image with that name. In a button or link, label the button or link instead.
                  <span class="tooltip-default">Default: none</span>
                </span>
              </TooltipIcon>
            </dt>
            <dd>
              <TextInput size="sm" labelText="title" hideLabel placeholder="None" bind:value={iconTitle} />
            </dd>
            <dt>Color</dt>
            <dd>
              <!-- Swatches of Carbon's icon and support tokens, as radios: the
                arrow keys move between them, and the name shows beside. -->
              <fieldset class="swatches">
                <legend class="visually-hidden">Color</legend>
                {#each colors as [token, label] (token)}
                  <label class="swatch" title={label}>
                    <input type="radio" name="icon-color" value={token} bind:group={colorToken} />
                    <span class="swatch-dot" style:background="var({token})"></span>
                    <span class="visually-hidden">{label}</span>
                  </label>
                {/each}
                <span class="swatch-name" aria-hidden="true">{colors.find(([token]) => token === colorToken)?.[1]}</span>
              </fieldset>
            </dd>
          {/if}
          <dt>
            Import
            <TooltipIcon icon={Information} direction="top" align="start" portalTooltip>
              <span slot="tooltipText">
                Direct imports the icon's own file, which every bundler handles quickly. Barrel imports from the package,
                which needs optimizeImports from carbon-preprocess-svelte, or development builds compile every icon.
                <span class="tooltip-default">Default: Direct</span>
              </span>
            </TooltipIcon>
          </dt>
          <dd>
            <ContentSwitcher size="sm" autoWidth lowContrast aria-label="Import" bind:selectedIndex={importIndex}>
              <Switch text="Direct" />
              <Switch text="Barrel" />
            </ContentSwitcher>
            {#if importStyle === "barrel"}
              <div class="import-tip">
                <IconIndicator kind="informative" label="Tip" />
                <p>Add <Link size="sm" href="https://github.com/carbon-design-system/carbon-preprocess-svelte#optimizeimports" target="_blank">optimizeImports</Link>
                from carbon-preprocess-svelte. Without it, your bundler compiles all {data.total.toLocaleString()} icons on every
                development build.</p>
              </div>
            {/if}
          </dd>
          {#if cost}
            <dt>Cost</dt>
            <dd class="text-value cost">
              {cost.bytes.toLocaleString()} B of SVG, gzipped · {cost.shapes} {cost.shapes === 1 ? "shape" : "shapes"}
            </dd>
          {/if}
          {#if categoryOf.get(selected)}
            <dt>Category</dt>
            {@const [category, subcategory] = categoryOf.get(selected)}
            <dd>
              <Breadcrumb noTrailingSlash labelText="Category">
                <BreadcrumbItem href="#{categoryId(category)}" on:click={(event) => goToGroup(event, categoryId(category))}>
                  {category}
                </BreadcrumbItem>
                <BreadcrumbItem
                  href="#{subcategoryOrCategoryId(category, subcategory)}"
                  on:click={(event) => goToGroup(event, subcategoryOrCategoryId(category, subcategory))}
                >
                  {subcategory}
                </BreadcrumbItem>
              </Breadcrumb>
            </dd>
          {/if}
          {#if aliasTerms[selected]}
            <dt>Keywords</dt>
            <dd class="tags-value">
              <!-- Plain tags: TagSet brings a modal for its "all tags" view,
                which a few keywords never need. -->
              <span class="keywords">
                {#each aliasTerms[selected] as term (term)}<Tag size="sm">{term}</Tag>{/each}
              </span>
            </dd>
          {/if}
          {#if canonicalToAliases[selected]}
            <dt>Formerly</dt>
            <dd>{canonicalToAliases[selected].join(", ")}</dd>
          {/if}
          {#if animatedNames.has(selected)}
            <dt>Animated</dt>
            <dd><Link href="/animated?icon={selected}">Try the animated version</Link></dd>
          {/if}
        </dl>
        {#if variants.length > 0}
          <!-- The same icon's other styles, as tiles like the gallery's. -->
          <section class="variants" aria-labelledby="icon-variants-heading">
            <p id="icon-variants-heading" class="variants-heading">Variants</p>
            <div class="gallery dense">
              {#each variants as name (name)}
                <button type="button" data-icon={name} on:click={() => showIcon(name)}>
                  <span class="tile-icon">{@html svgs[name] ?? ""}</span>
                  <span class="tile-name">{@html nameHtml(name)}</span>
                </button>
              {/each}
            </div>
          </section>
        {/if}
      </Layer>
    </div>
  {/if}
</SidePanel>

<style>
  /* Its own line under the switch: the row wraps. */
  .prop-list dd:has(.import-tip) {
    flex-wrap: wrap;
  }

  .size-strip {
    display: flex;
    align-items: flex-end;
    gap: var(--cds-spacing-03);
  }

  .size-option {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: var(--cds-spacing-03);
    padding: var(--cds-spacing-03) var(--cds-spacing-04);
    border: 1px solid transparent;
    background: none;
    /* The strip's color, the chosen token, reaches the icons. */
    color: inherit;
    cursor: pointer;
    font: inherit;
  }

  .size-option span {
    font-size: 0.75rem;
    letter-spacing: 0.32px;
    color: var(--cds-text-secondary, var(--cds-text-02));
  }

  .size-option:hover {
    background: var(--cds-layer-hover, var(--cds-hover-ui));
  }

  .size-option[aria-pressed="true"] {
    border-color: var(--cds-border-strong, var(--cds-ui-04));
  }

  .size-option[aria-pressed="true"] span {
    color: var(--cds-text-primary, var(--cds-text-01));
  }

  .size-option:focus-visible {
    outline: 2px solid var(--cds-focus, var(--cds-interactive-01));
    outline-offset: -2px;
  }

  .variants {
    padding-block-end: var(--cds-spacing-05);
    border-block-start: 1px solid var(--cds-border-subtle, var(--cds-ui-03));
  }

  /* Tiles on the panel's own layer, so they stand out like the gallery's. */
  .variants :global(.gallery button) {
    background: var(--cds-layer-02, var(--cds-ui-02));
  }

  .variants :global(.gallery button:hover) {
    background: var(--cds-layer-hover, var(--cds-hover-ui));
  }

  .swatches {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--cds-spacing-02);
    margin: 0;
    padding: 0;
    border: 0;
  }

  .swatch {
    position: relative;
    display: flex;
    padding: var(--cds-spacing-02);
    cursor: pointer;
  }

  .swatch input {
    position: absolute;
    inset: 0;
    margin: 0;
    opacity: 0;
    cursor: pointer;
  }

  .swatch-dot {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px var(--cds-border-subtle-01, var(--cds-ui-03));
  }

  /* The chosen color: a ring around its swatch. */
  .swatch:has(input:checked) .swatch-dot {
    box-shadow:
      0 0 0 2px var(--cds-layer-01, var(--cds-ui-01)),
      0 0 0 3px var(--cds-text-primary, var(--cds-text-01));
  }

  .swatch:has(input:focus-visible) {
    outline: 2px solid var(--cds-focus, var(--cds-interactive-01));
    outline-offset: -2px;
  }

  .swatch-name {
    margin-inline-start: var(--cds-spacing-03);
    font-size: 0.875rem;
    color: var(--cds-text-secondary, var(--cds-text-02));
  }

  .status {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--cds-spacing-03);
    font-size: 0.875rem;
    line-height: 1.125rem;
    color: var(--cds-text-secondary, var(--cds-text-02));
  }

  .status p {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.125rem;
    color: var(--cds-text-secondary, var(--cds-text-02));
  }

  .cost {
    font-size: 0.875rem;
    line-height: 1.125rem;
    color: var(--cds-text-secondary, var(--cds-text-02));
  }

  .variants-heading {
    margin: 0 0 var(--cds-spacing-04);
    padding-block-start: var(--cds-spacing-04);
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.125rem;
    color: var(--cds-text-secondary, var(--cds-text-02));
  }

  .variants :global(.tile-icon svg) {
    width: 24px;
    height: 24px;
  }

  .status {
    font-size: 0.875rem;
    line-height: 1.125rem;
    color: var(--cds-text-secondary, var(--cds-text-02));
  }

  .import-tip p {
    margin: 0;
    font-size: 0.75rem;
    line-height: 1rem;
    letter-spacing: 0.32px;
    color: var(--cds-text-secondary, var(--cds-text-02));
  }

  /* Tall enough for the size strip, so switching to a button preview
     doesn't change the preview's height. */
  .explorer .stage.stage-static {
    min-height: 6.5rem;
  }

  /* The barrel import's tip: Carbon's informative indicator labelled
     "Tip", then the advice, so it reads as advice, not small print. */
  .import-tip {
    display: flex;
    flex-direction: column;
    gap: var(--cds-spacing-02);
    flex-basis: 100%;
    max-width: 30rem;
    margin-block-start: var(--cds-spacing-04);
  }
</style>
