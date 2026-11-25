<script>
  import { CodeSnippet } from "carbon-components-svelte";
  import { highlightCode } from "carbon-components-svelte/syntax";

  export let code = "";
  export let language = "svelte";
  /** Wrap long lines instead of scrolling. */
  export let wrapText = false;
</script>

<!-- Always the whole code, with no row limit or show more. Measuring for
  show more fires a ResizeObserver loop error for short code passed
  `expanded` (carbon-components-svelte#5791), and clips code of 14 or 15
  rows by its bottom padding (#5782). -->
<div class="code" use:highlightCode={language}>
  <CodeSnippet
    type={code.includes("\n") ? "multi" : "single"}
    {code}
    {wrapText}
    maxCollapsedNumberOfRows={0}
    showMoreLess={false}
    fullWidth
  />
</div>
