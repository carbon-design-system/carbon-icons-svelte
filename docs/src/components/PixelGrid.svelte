<script>
  /**
   * The icon rasterized at each of Carbon's sizes and enlarged pixel by
   * pixel, over a pixel grid with the 1/16 keyline padding Carbon draws
   * icons within, and the share of its pixels that are fully solid: a
   * crisp icon at a size has few half-covered, blurry pixels.
   */
  import { onMount } from "svelte";

  /** The icon's SVG markup. */
  export let svg = "";

  const sizes = [16, 20, 24, 32];
  // Each size enlarged to about 128px.
  const scaleOf = (size) => Math.floor(128 / size);

  /** @type {Record<number, HTMLCanvasElement>} */
  let canvases = {};
  /** The share of an icon's covered pixels that are solid, by size. */
  let solid = {};
  let mounted = false;
  onMount(() => (mounted = true));

  const draw = async (markup) => {
    const style = getComputedStyle(document.body);
    const ink = style.color;
    const line = style.getPropertyValue("--cds-border-subtle-01").trim() || "rgba(128, 128, 128, 0.3)";
    const keyline = style.getPropertyValue("--cds-support-info").trim() || "#0043ce";
    const next = {};
    for (const size of sizes) {
      const canvas = canvases[size];
      if (!canvas) continue;
      const source = markup
        .replace(/width="\d+" height="\d+"/, `width="${size}" height="${size}"`)
        .replace(/fill="currentColor"/g, 'fill="#000"');
      const image = new Image();
      image.src = `data:image/svg+xml,${encodeURIComponent(source)}`;
      await image.decode().catch(() => {});
      const small = document.createElement("canvas");
      small.width = small.height = size;
      const smallContext = small.getContext("2d", { willReadFrequently: true });
      smallContext.drawImage(image, 0, 0, size, size);
      const pixels = smallContext.getImageData(0, 0, size, size).data;

      const scale = scaleOf(size);
      canvas.width = canvas.height = size * scale;
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      let covered = 0;
      let full = 0;
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const alpha = pixels[(y * size + x) * 4 + 3] / 255;
          if (alpha === 0) continue;
          covered++;
          if (alpha >= 0.9) full++;
          context.globalAlpha = alpha;
          context.fillStyle = ink;
          context.fillRect(x * scale, y * scale, scale, scale);
        }
      }
      context.globalAlpha = 1;
      // The keyline: Carbon draws within 1/16 of the artboard from each edge.
      const pad = (size / 16) * scale;
      context.fillStyle = keyline;
      context.globalAlpha = 0.12;
      context.fillRect(0, 0, canvas.width, pad);
      context.fillRect(0, canvas.height - pad, canvas.width, pad);
      context.fillRect(0, pad, pad, canvas.height - 2 * pad);
      context.fillRect(canvas.width - pad, pad, pad, canvas.height - 2 * pad);
      context.globalAlpha = 1;
      context.strokeStyle = line;
      context.lineWidth = 1;
      context.beginPath();
      for (let i = 0; i <= size; i++) {
        const at = i * scale + 0.5;
        context.moveTo(at, 0);
        context.lineTo(at, canvas.height);
        context.moveTo(0, at);
        context.lineTo(canvas.width, at);
      }
      context.stroke();
      next[size] = covered ? Math.round((full / covered) * 100) : 0;
    }
    solid = next;
  };

  $: if (mounted && svg) draw(svg);
</script>

<div class="pixels">
  {#each sizes as size (size)}
    <figure>
      <canvas bind:this={canvases[size]} style:width="{size * scaleOf(size)}px" style:height="{size * scaleOf(size)}px"></canvas>
      <figcaption>
        {size}px{#if solid[size] !== undefined}<span>{" · "}{solid[size]}% solid</span>{/if}
      </figcaption>
    </figure>
  {/each}
</div>

<style>
  .pixels {
    display: flex;
    flex-wrap: wrap;
    gap: var(--cds-spacing-06);
  }

  figure {
    display: flex;
    flex-direction: column;
    gap: var(--cds-spacing-03);
    margin: 0;
  }

  canvas {
    image-rendering: pixelated;
  }

  figcaption {
    font-size: 0.75rem;
    letter-spacing: 0.32px;
    color: var(--cds-text-primary, var(--cds-text-01));
  }

  figcaption span {
    color: var(--cds-text-secondary, var(--cds-text-02));
  }
</style>
