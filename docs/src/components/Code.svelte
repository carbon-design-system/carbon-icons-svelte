<script>
  import { CodeSnippet } from "carbon-components-svelte";
  import { highlightCode } from "carbon-components-svelte/syntax";

  export let code = "";
  export let language = "svelte";
</script>

<div class="code" use:highlightCode={language}>
  <CodeSnippet type={code.includes("\n") ? "multi" : "single"} {code} expanded fullWidth />
</div>
