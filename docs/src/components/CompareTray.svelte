<script>
  /**
   * Icons pinned for comparison, side by side at one size in a tray along
   * the bottom of the page, with their imports to copy at once.
   */
  import { Button } from "carbon-components-svelte";
  import Checkmark from "carbon-icons-svelte/lib/Checkmark.svelte";
  import Close from "carbon-icons-svelte/lib/Close.svelte";
  import Copy from "carbon-icons-svelte/lib/Copy.svelte";
  import { createEventDispatcher } from "svelte";

  /** The pinned icons' names. */
  export let names = [];
  /** Each icon's SVG markup, by name. */
  export let svgs = {};
  /** The icon size to compare at. */
  export let size = 24;
  /** The import line for an icon. */
  export let importFor = (name) => name;

  const dispatch = createEventDispatcher();
  const sized = (svg, at) => svg.replace(/width="\d+" height="\d+"/, `width="${at}" height="${at}"`);

  let copied = false;
  const copyImports = async () => {
    await navigator.clipboard.writeText(names.map(importFor).join("\n"));
    copied = true;
    setTimeout(() => (copied = false), 2000);
  };
</script>

{#if names.length > 0}
  <section class="tray" aria-label="Compare">
    <div class="tray-header">
      <h2 class="tray-title">Compare <span>({names.length})</span></h2>
      <div class="tray-actions">
        <Button kind="ghost" size="small" icon={copied ? Checkmark : Copy} on:click={copyImports}>
          {copied ? "Copied!" : "Copy imports"}
        </Button>
        <Button kind="ghost" size="small" on:click={() => (names = [])}>Clear</Button>
      </div>
    </div>
    <ul class="tray-icons">
      {#each names as name (name)}
        <li>
          <button type="button" class="tray-icon" title="Open {name}" on:click={() => dispatch("open", name)}>
            {@html sized(svgs[name] ?? "", size)}
            <!-- A line may break between the words of a name. -->
            <span>{@html name.split(/(?=[A-Z_])/).join("<wbr>")}</span>
          </button>
          <Button
            kind="ghost"
            size="small"
            icon={Close}
            iconDescription="Remove {name}"
            tooltipPosition="top"
            class="tray-remove"
            on:click={() => (names = names.filter((other) => other !== name))}
          />
        </li>
      {/each}
    </ul>
  </section>
{/if}

<style>
  .tray {
    position: fixed;
    inset-inline: 0;
    inset-block-end: 0;
    z-index: 6000;
    max-height: 40vh;
    overflow: auto;
    padding: var(--cds-spacing-03) var(--cds-spacing-05) var(--cds-spacing-04);
    background: var(--cds-layer-01, var(--cds-ui-01));
    border-block-start: 1px solid var(--cds-border-subtle-01, var(--cds-ui-03));
    box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.2);
  }

  .tray-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .tray-title {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.29;
  }

  .tray-title span {
    font-weight: 400;
    color: var(--cds-text-secondary, var(--cds-text-02));
  }

  .tray-actions {
    display: flex;
  }

  .tray-icons {
    display: flex;
    flex-wrap: wrap;
    gap: 1px;
    margin: var(--cds-spacing-03) 0 0;
    padding: 0;
    list-style: none;
  }

  li {
    position: relative;
  }

  .tray-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--cds-spacing-03);
    width: 6.5rem;
    min-height: 5.5rem;
    padding: var(--cds-spacing-04) var(--cds-spacing-03);
    border: 0;
    background: var(--cds-layer-02, var(--cds-ui-02));
    color: var(--cds-text-primary, var(--cds-text-01));
    font: inherit;
    cursor: pointer;
  }

  .tray-icon:hover {
    background: var(--cds-layer-hover-02, var(--cds-hover-ui));
  }

  .tray-icon :global(svg) {
    fill: currentColor;
  }

  .tray-icon span {
    max-width: 100%;
    font-size: 0.75rem;
    letter-spacing: 0.32px;
    text-align: center;
    color: var(--cds-text-secondary, var(--cds-text-02));
  }

  li :global(.tray-remove) {
    position: absolute;
    inset-block-start: 0;
    inset-inline-end: 0;
  }
</style>
