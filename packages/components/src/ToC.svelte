<script>
	import { afterUpdate } from "svelte";
	import Icon from "./Icon.svelte";
	export let sections = [];
	export let active_section = null;
	export let show_contents;
	export let prevent_sidebar_scroll = false;
	export let dir;
	let ul;
	afterUpdate(() => {
		// bit of a hack — prevent sidebar scrolling if
		// TOC is open on mobile, or scroll came from within sidebar
		if (prevent_sidebar_scroll || (show_contents && window.innerWidth < 832))
			return;
		const active = ul.querySelector(".active");
		if (active) {
			const { top, bottom } = active.getBoundingClientRect();
			const min = 200;
			const max = window.innerHeight - 200;
			if (top > max) {
				ul.parentNode.scrollBy({
					top: top - max,
					left: 0,
					behavior: "smooth",
				});
			} else if (bottom < min) {
				ul.parentNode.scrollBy({
					top: bottom - min,
					left: 0,
					behavior: "smooth",
				});
			}
		}
	});

	// console.log(sections);
</script>

<ul
	bind:this={ul}
	class="reference-toc"
	on:mouseenter={() => (prevent_sidebar_scroll = true)}
	on:mouseleave={() => (prevent_sidebar_scroll = false)}
>
	{#each sections as section}
		<li class="section-1">
			<a
				class="section"
				class:active={section.slug === active_section}
				href="{dir}#{section.slug}"
			>
				{@html section.title}

				{#if section.slug === active_section}
					<div class="icon-container">
						<Icon name="arrow-right" />
					</div>
				{/if}
			</a>
			<ul>
				{#each section.sections as subsection}
					<!-- see <script> below: on:click='scrollTo(event, subsection.slug)' -->
					<li>
						<a
							class="subsection"
							class:active={subsection.slug === active_section}
							href="{dir}#{subsection.slug}"
							data-level={subsection.level}
						>
							{@html subsection.title}

							{#if subsection.slug === active_section}
								<div class="icon-container">
									<Icon name="arrow-right" />
								</div>
							{/if}
						</a>
						{#if subsection.sections.length}
							<ul>
								{#each subsection.sections as subsubsection}
									<li>
										<a
											class="subsection"
											class:active={subsubsection.slug === active_section}
											href="{dir}#{subsubsection.slug}"
											data-level={subsection.level}
										>
											{@html subsubsection.title}

											{#if subsubsection.slug === active_section}
												<div class="icon-container">
													<Icon name="arrow-right" />
												</div>
											{/if}
										</a>
									</li>
								{/each}
							</ul>
						{/if}
					</li>
				{/each}
			</ul>
		</li>
	{/each}
</ul>

<style>
	.section-1 {
		display: block;
		line-height: 1.2;
		margin: 0 0 4rem 0;
	}

	.reference-toc > li > ul > li > ul {
		padding-left: 1.2rem;
		margin-bottom: 0;
	}

	ul {
		list-style: none;
	}
	a {
		position: relative;
		transition: color 0.2s;
		border-bottom: none;
		padding: 0;
		color: var(--second);
	}
	.section {
		display: block;
		padding: 0 0 0.8rem 0;
		font-size: var(--h6);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-weight: 600;
	}
	.subsection {
		display: block;
		font-size: 1.6rem;
		font-family: var(--font);
		padding: 0 0 0.6em 0;
	}
	.section:hover,
	.subsection:hover,
	.active {
		color: var(--flash);
	}
	.subsection[data-level="4"] {
		padding-left: 1.2rem;
	}
	.icon-container {
		position: absolute;
		top: -0.2rem;
		right: 2.4rem;
	}
	@media (min-width: 832px) {
		a {
			color: var(--sidebar-text);
		}
		a:hover,
		.section:hover,
		.subsection:hover,
		.active {
			color: white;
		}
	}
</style>
