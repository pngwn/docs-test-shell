import github from "@actions/github";
import core from "@actions/core";

async function get_files_from_repo(client, target_repo, base_dir) {
	const content = await client.repos.getContent({
		owner: "pngwn",
		repo: target_repo,
		path: base_dir,
	});

	return await Promise.all(
		content.data.map(async (data) => {
			if (data.type === "file" && data.contents) return data;
			else return await get_files_from_repo(client, target_repo, data.path);
		})
	);
}

function run() {
	const type = core.getInput("type");
	const target_repo = core.getInput("repo");
	const base_dir = core.getInput("base");
	const token = core.getInput("token");
	console.log(type, "\n", target_repo, "\n", base_dir);
	console.log(JSON.stringify(github, null, 2));

	const octokit = github.getOctokit(token);
	const files = get_files_from_repo(octokit, target_repo, base_dir);
	console.log(files);

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
