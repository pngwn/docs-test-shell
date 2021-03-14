<script context="module">
	export async function load({ fetch }) {
		let r = await fetch("https://svelte-api.pngwn.workers.dev", {
			highWaterMark: 1024 * 1024,
		});
		console.log(r, "hi");
		const docs = await r.json();

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
