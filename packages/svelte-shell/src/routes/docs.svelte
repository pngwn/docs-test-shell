<script context="module">
	import { docs } from "./_docs.js";

	export async function load() {
		return {
			props: {
				docs,
			},
		};
	}
</script>

<script>
	import { Docs } from "@site/comps";

	export let docs;
</script>

<Docs sections={docs} />
