<script>
  import { CodeSnippet } from "carbon-components-svelte";
  import { highlightCode } from "carbon-components-svelte/syntax";

  export let code = "";
  export let language = "svelte";
  /** Wrap long lines instead of scrolling. */
  export let wrapText = false;
</script>

<!-- Always the whole code, with no row limit or show more: examples are
  short, and a toggle would hide part of one. -->
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
