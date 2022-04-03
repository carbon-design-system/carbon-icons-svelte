<script>
  export let version = undefined;

  import {
    Header,
    HeaderUtilities,
    HeaderAction,
    HeaderActionLink,
    HeaderPanelLinks,
    HeaderPanelLink,
    HeaderPanelDivider,
    SkipToContent,
  } from "carbon-components-svelte";
  import LogoGithub from "../../../lib/LogoGithub.svelte";
</script>

<Header aria-label="Navigation" href="/">
  <svelte:fragment slot="skip-to-content">
    <SkipToContent />
  </svelte:fragment>

  <span slot="platform" class="platform-name">
    Carbon Icons Svelte
    <code title="Version {version}">v{version}</code>
  </span>

  <HeaderUtilities>
    <HeaderActionLink
      href="https://github.com/carbon-design-system/carbon-icons-svelte"
      target="_blank"
    >
      <LogoGithub slot="icon" size={20} />
    </HeaderActionLink>
    <HeaderAction transition={false}>
      <HeaderPanelLinks>
        <HeaderPanelDivider>Carbon Svelte portfolio</HeaderPanelDivider>
        <HeaderPanelLink href="https://github.com/IBM/carbon-components-svelte">
          Carbon Components Svelte
        </HeaderPanelLink>
        <HeaderPanelLink href="https://github.com/IBM/carbon-pictograms-svelte">
          Carbon Pictograms Svelte
        </HeaderPanelLink>
        <HeaderPanelLink
          href="https://github.com/carbon-design-system/carbon-charts/tree/master/packages/svelte"
        >
          Carbon Charts Svelte
        </HeaderPanelLink>
        <HeaderPanelLink href="https://github.com/IBM/carbon-preprocess-svelte">
          Carbon Preprocess Svelte
        </HeaderPanelLink>
        <HeaderPanelDivider>Resources</HeaderPanelDivider>
        <HeaderPanelLink href="https://www.carbondesignsystem.com/">
          Carbon Design System
        </HeaderPanelLink>
        <HeaderPanelLink href="https://www.ibm.com/design/language/">
          IBM Design Language
        </HeaderPanelLink>
      </HeaderPanelLinks>
    </HeaderAction>
  </HeaderUtilities>
</Header>

<style>
  .platform-name {
    display: flex;
    align-items: baseline;
  }

  .platform-name code {
    margin-left: var(--cds-spacing-02);
    font-size: var(--cds-code-01-font-size);
    font-weight: var(--cds-code-01-font-weight);
    letter-spacing: var(--cds-code-01-letter-spacing);
    line-height: var(--cds-code-01-line-height);
    color: #c6c6c6;
  }
</style>
