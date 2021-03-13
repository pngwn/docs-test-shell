<script>
	import { page, navigating } from "$app/stores";
	import { Icon, Icons, Nav, NavItem } from "@site/comps";
	import "../vars.css";
</script>

<Icons />
<Nav {page} logo="svelte-logo-horizontal.svg">
	<NavItem segment="examples">Tutorials</NavItem>
	<NavItem segment="docs">API</NavItem>
	<NavItem segment="lang-tools">Language Tools</NavItem>

	<NavItem external="https://github.com/sveltejs/svelte" title="GitHub Repo">
		<Icon name="github" />
	</NavItem>
</Nav>

<main>
	<slot />
</main>

<style>
	main {
		position: relative;
		margin: 0 auto;
		/* padding: var(--nav-h) var(--side-nav) 0 var(--side-nav); */
		padding: var(--nav-h) 0 0 0;
		overflow-x: hidden;
	}
</style>
