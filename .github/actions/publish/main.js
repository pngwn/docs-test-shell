import github from "@actions/github";
import core from "@actions/core";

// this was really clever but github suck

async function get_files_from_repo(client, target_repo, base_dir) {
	const content = await client.repos.getContent({
		owner: "pngwn",
		repo: target_repo,
		path: base_dir,
	});
	// if (!Array.isArray(content.data)) console.log(base_dir, content);

	if (content.data.type === "file" && content.data.content)
		return [content.data];

	return await Promise.all(
		content.data.map(async (data) => {
			// if (data.type === "file" && data.contents) return data;
			return await get_files_from_repo(client, target_repo, data.path);
		})
	);
}

function base64_to_string(encoded) {
	return Buffer.from(encoded, "base64").toString();
}

function find_type(array, base) {
	if (!array[0].path) return find_type(array[0], base);
	console.log(array[0].path, base);
	const re = new RegExp(`^${base}\/(\w+)\/`);
	const [, type] = array[0].path.match(re);
	return type;
}

async function run() {
	const type = core.getInput("type");
	const target_repo = core.getInput("repo");
	const base_dir = core.getInput("base");
	const token = core.getInput("token");
	console.log(type, "\n", target_repo, "\n", base_dir);
	// console.log(JSON.stringify(github, null, 2));

	const octokit = github.getOctokit(token);
	const files = await get_files_from_repo(octokit, target_repo, base_dir);

	const categories = {};
	const sorted = files.forEach((arr) => {
		const type = find_type(arr, base);
		console.log(type);

		if (categories[type]) categories[type].push(arr);
		else categories[type] = [arr];
	}, {});

	console.log(categories);

	// get TAG, get PROJECT
	// console.log(JSON.stringify(github.payload, null, 2));

	// for each doc type -> tranform

	// get VERSION from tag
	// for each doctype: (DOCTYPE, DOCS) =>

	// if (tag) {
	// [DOCTYPE]:[PROJECT]:[VERSION] = [DOCS]
	// [DOCTYPE]:[PROJECT]:latest = [DOCS]
	// }

	// [DOCTYPE]:[PROJECT]:next = [DOCS]

	// write to disk => ${WORKFLOW_DIR}/.temp_kv_store
}

run();

// What if there are multiple versions? Multiple tags?
