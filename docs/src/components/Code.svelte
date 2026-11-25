<script>
  import { CodeSnippet } from "carbon-components-svelte";
  import { highlightCode } from "carbon-components-svelte/syntax";

  export let code = "";
  export let language = "svelte";
  /** Wrap long lines instead of scrolling. */
  export let wrapText = false;

  // Only code past the snippet's 15 collapsed rows needs expanding. A
  // shorter snippet with `expanded` collapses itself as it first lays out,
  // which fires a ResizeObserver loop error (carbon-components-svelte#5791).
  $: long = code.split("\n").length > 15;
</script>

<div class="code" use:highlightCode={language}>
  <CodeSnippet type={code.includes("\n") ? "multi" : "single"} {code} {wrapText} expanded={long} fullWidth />
</div>
