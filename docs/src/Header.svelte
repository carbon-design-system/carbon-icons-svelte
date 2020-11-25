<script>
  import {
    Header,
    HeaderUtilities,
    HeaderAction,
    HeaderActionLink,
    HeaderPanelLinks,
    HeaderPanelLink,
    HeaderPanelDivider,
    SkipToContent,
    SideNav,
    SideNavItems,
    SideNavMenu,
    SideNavMenuItem,
  } from "carbon-components-svelte";
  import LogoGithub20 from "carbon-icons-svelte/lib/LogoGithub20";
</script>

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

  :global(.bx--header__menu-toggle) {
    display: none;
  }
</style>

<Header aria-label="Navigation" href="/carbon-icons-svelte/">
  <div slot="skip-to-content">
    <SkipToContent />
  </div>

  <span slot="platform" class="platform-name">
    Carbon Icons Svelte
    <code>v{window.VERSION}</code>
  </span>

  <HeaderUtilities>
    <HeaderActionLink
      icon={{ render: LogoGithub20 }}
      href="https://github.com/IBM/carbon-icons-svelte"
      target="_blank" />
    <HeaderAction>
      <HeaderPanelLinks>
        <HeaderPanelDivider>Carbon Svelte portfolio</HeaderPanelDivider>
        <HeaderPanelLink href="https://github.com/IBM/carbon-components-svelte">
          Carbon Components Svelte
        </HeaderPanelLink>
        <HeaderPanelLink href="https://github.com/IBM/carbon-pictograms-svelte">
          Carbon Pictograms Svelte
        </HeaderPanelLink>
        <HeaderPanelLink
          href="https://github.com/carbon-design-system/carbon-charts/tree/master/packages/svelte">
          Carbon Charts Svelte
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
