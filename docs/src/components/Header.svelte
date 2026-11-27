<script>
  import {
    Header,
    HeaderNav,
    HeaderNavItem,
    HeaderUtilities,
    HeaderAction,
    HeaderActionLink,
    HeaderPanelLinks,
    HeaderPanelLink,
    HeaderPanelDivider,
    SideNav,
    SideNavDivider,
    SideNavItems,
    SideNavLink,
    SideNavMenu,
    SideNavMenuItem,
    SkipToContent,
  } from "carbon-components-svelte";
  import LogoGithub from "./LogoGithub.svelte";
  import { VERSION } from "../constants";
  import { pageLinks } from "../page-links.js";

  /** @type {"icons" | "animated"} */
  export let route = "icons";

  // Below the header's breakpoint the page links move into a side nav,
  // opened by the header's menu button. Closed by default on wide screens,
  // where the header shows the links.
  let isSideNavOpen = false;
</script>

<Header aria-label="Navigation" href="/" expandedByDefault={false} bind:isSideNavOpen>
  <svelte:fragment slot="skipToContent">
    <SkipToContent />
  </svelte:fragment>

  <span slot="platform" class="platform-name">
    Carbon Icons Svelte
    <code title="Version {VERSION}">v{VERSION}</code>
  </span>

  <HeaderNav aria-label="Pages">
    <HeaderNavItem href="/" text="Icons" isSelected={route === "icons"} />
    <HeaderNavItem href="/animated" text="Animated" isSelected={route === "animated"} />
  </HeaderNav>

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
        <HeaderPanelLink href="https://github.com/carbon-design-system/carbon-components-svelte">
          Carbon Components Svelte
        </HeaderPanelLink>
        <HeaderPanelLink href="https://github.com/carbon-design-system/carbon-pictograms-svelte">
          Carbon Pictograms Svelte
        </HeaderPanelLink>
        <HeaderPanelLink
          href="https://github.com/carbon-design-system/carbon-charts/tree/master/packages/svelte"
        >
          Carbon Charts Svelte
        </HeaderPanelLink>
        <HeaderPanelLink href="https://github.com/carbon-design-system/carbon-preprocess-svelte">
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

<SideNav bind:isOpen={isSideNavOpen} ariaLabel="Pages">
  <SideNavItems>
    <SideNavLink href="/" text="Icons" isSelected={route === "icons"} on:click={() => (isSideNavOpen = false)} />
    <SideNavLink href="/animated" text="Animated" isSelected={route === "animated"} on:click={() => (isSideNavOpen = false)} />
    {#if route === "animated" && $pageLinks.length > 0}
      <SideNavDivider />
      <SideNavMenu text="On this page" expanded>
        {#each $pageLinks as link (link.href)}
          <SideNavMenuItem
            href={link.href}
            text={link.text}
            class={link.nested ? "nav-nested" : undefined}
            on:click={() => (isSideNavOpen = false)}
          />
        {/each}
      </SideNavMenu>
    {/if}
  </SideNavItems>
</SideNav>

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
  }

  /* Icon groups sit under their section. */
  :global(.bx--side-nav__link.nav-nested) {
    padding-inline-start: 3rem;
  }

  /* Next to the menu button, the name and version don't fit on one line. */
  @media (max-width: 41.98rem) {
    .platform-name code {
      display: none;
    }
  }
</style>
