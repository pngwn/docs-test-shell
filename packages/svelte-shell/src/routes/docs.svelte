<script context="module">
	export async function load({ fetch }) {
		console.log(fetch);
		const res = await fetch(`https://svelte-api.pngwn.workers.dev/`);
		console.log(res);
		const docs = await res.json();

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
