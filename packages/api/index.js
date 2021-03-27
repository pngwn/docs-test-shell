import { Router } from "worktop";
import { read } from "worktop/kv";

const API = new Router();

API.prepare = async function (req, res) {
	res.setHeader("Access-Control-Allow-Methods", "HEAD,GET,POST,PUT, DELETE");
	res.setHeader("Access-Control-Allow-Origin", req.headers.get("Origin"));
	res.setHeader(
		"Access-Control-Allow-Headers",
		req.headers.get("Access-Control-Request-Headers")
	);
};

API.add("GET", "/docs/:pkg/:type", async (req, res) => {
	console.log("hi");
	const version = req.query.get("v") || "latest";
	const { type, pkg } = req.params;

	const key = `${pkg}:${type}:${version}`;
	console.log(key);

	const message = await read(SVELTE_DOCS, key);

	if (message) {
		console.log(message);
		res.send(200, message);
	} else {
		res.send(404, { body: `Entry for '${pkg}/${type}' not found.` });
	}
});

API.add("GET", "/docs/:pkg/:type/list", async (req, res) => {
	console.log("hi");
	const version = req.query.get("v") || "latest";
	const { type, pkg, list } = req.params;

	const key = `${pkg}:${type}:list:${version}`;

	const message = await read(SVELTE_DOCS, key);

	if (message) {
		console.log(message);
		res.send(200, message);
	} else {
		res.send(404, { body: `Entry for '${pkg}/${type}' not found.` });
	}
});

API.add("GET", "/docs/:pkg/:type/:id", async (req, res) => {
	console.log("id endpoint");
	const version = req.query.get("v") || "latest";

	const { type, pkg, id } = req.params;

	console.log(
		`id endpoint. Version: ${version}. Key: ${pkg}:${type}:${id}:${version}`
	);

	const key = `${pkg}:${type}:${id}:${version}`;

	const message = await read(SVELTE_DOCS, key);

	if (message) {
		console.log(message);
		res.send(200, message);
	} else {
		res.send(404, {
			body: `ID '${id}' for entity '${pkg}/${type}' not found.`,
		});
	}
});

API.add("GET", "/docs/:pkg/:type/versions", async (req, res) => {
	console.log("id endpoint");
	const version = req.query.get("v") || "latest";

	const { type, pkg, id } = req.params;

	console.log(`id endpoint. Version: ${version}. Key: ${pkg}:${type}:versions`);

	const key = `${pkg}:${type}:${id}:versions`;

	const message = await read(SVELTE_DOCS, key);

	if (message) {
		console.log(message);
		res.send(200, message);
	} else {
		res.send(404, {
			body: `ID '${id}' for entity '${pkg}/${type}' not found.`,
		});
	}
});

addEventListener("fetch", API.listen);
// API.add("GET", "/docs/:pkg/:type/:list", async (req, res) => {
// 	const version = req.query.get("v") || "latest";
// 	const { type, pkg } = req.params;

// 	const key = `${type}:${pkg}:${list}:${version}`;
// 	const message = await read(SVELTE_DOCS, key);

// 	res.send(200, message);
// });

// list endpoint
// /docs/api/list/svelte
// /docs/tutorials/list/svelte
// /docs/examples/list/svelte
