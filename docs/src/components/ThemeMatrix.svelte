<script>
  /**
   * An icon on every Carbon theme and on each theme's main surfaces, with
   * the contrast of its color against each. WCAG asks 3:1 for graphics
   * that carry meaning; lower is flagged.
   */
  import { afterUpdate } from "svelte";

  /** The icon's SVG markup. */
  export let svg = "";
  /** The CSS variable the icon is colored with, like "--cds-icon-primary". */
  export let token = "--cds-icon-primary";
  /** The icon's size in pixels. */
  export let size = 24;

  const themes = [
    ["white", "White"],
    ["g10", "Gray 10"],
    ["g80", "Gray 80"],
    ["g90", "Gray 90"],
    ["g100", "Gray 100"],
  ];
  const surfaces = [
    ["--cds-background", "Background"],
    ["--cds-layer-01", "Layer"],
    ["--cds-field-01", "Field"],
  ];

  $: sized = svg.replace(/width="\d+" height="\d+"/, `width="${size}" height="${size}"`);

  /** @param {string} color */
  const channels = (color) => (color.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
  /** Relative luminance, per WCAG. */
  const luminance = ([r, g, b]) => {
    const linear = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
  };
  const ratio = (a, b) => {
    const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (high + 0.05) / (low + 0.05);
  };

  let grid;
  /** Contrast for each cell, by "theme surface". */
  let contrast = {};
  // Read from the rendered cells, so each theme's real token values count.
  afterUpdate(() => {
    if (!grid) return;
    const next = {};
    for (const cell of grid.querySelectorAll("[data-cell]")) {
      const background = channels(getComputedStyle(cell).backgroundColor);
      const icon = channels(getComputedStyle(cell.querySelector(".matrix-icon")).color);
      if (background.length === 3 && icon.length === 3) next[cell.dataset.cell] = ratio(background, icon);
    }
    if (JSON.stringify(next) !== JSON.stringify(contrast)) contrast = next;
  });
</script>

<div class="matrix" bind:this={grid} style:--matrix-columns={surfaces.length}>
  <span></span>
  {#each surfaces as [, label] (label)}<span class="matrix-heading">{label}</span>{/each}
  {#each themes as [theme, themeLabel] (theme)}
    <span class="matrix-heading matrix-row">{themeLabel}</span>
    {#each surfaces as [surface, surfaceLabel] (surface)}
      {@const key = `${theme} ${surface}`}
      {@const value = contrast[key]}
      <div
        class="matrix-cell bx--{theme}"
        data-cell={key}
        style:background="var({surface})"
        title="{themeLabel}, {surfaceLabel}"
      >
        <span class="matrix-icon" style:color="var({token})">{@html sized}</span>
        {#if value}
          <span class="matrix-ratio" class:low={value < 3}>{value.toFixed(1)}:1{value < 3 ? " ⚠" : ""}</span>
        {/if}
      </div>
    {/each}
  {/each}
</div>

<style>
  .matrix {
    display: grid;
    grid-template-columns: 4.5rem repeat(var(--matrix-columns), minmax(0, 1fr));
    gap: 1px;
    width: 100%;
  }

  .matrix-heading {
    align-self: end;
    padding: 0 0 var(--cds-spacing-02);
    font-size: 0.75rem;
    letter-spacing: 0.32px;
    color: var(--cds-text-secondary, var(--cds-text-02));
  }

  .matrix-row {
    align-self: center;
    padding: 0;
  }

  .matrix-cell {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--cds-spacing-03);
    min-height: 3rem;
    padding: var(--cds-spacing-03) var(--cds-spacing-04);
  }

  .matrix-icon {
    display: flex;
  }

  .matrix-icon :global(svg) {
    fill: currentColor;
  }

  .matrix-ratio {
    font-size: 0.75rem;
    letter-spacing: 0.32px;
    color: var(--cds-text-secondary, var(--cds-text-02));
  }

  .matrix-ratio.low {
    color: var(--cds-text-error, var(--cds-support-01));
  }
</style>
