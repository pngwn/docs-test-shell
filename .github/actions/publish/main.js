import github from "@actions/github";
import core from "@actions/core";
import exec from "@actions/exec";
import fs from "fs";
import path from "path";

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

async function get_repo(target_branch) {
	const tmp_dir_name = `__tmp_${target_branch}`;

	// we want to clone the necessary branch and only that branch
	// but we don't want files because we want to sparsely checkout the branch later
	// we also don't want any history, we only care about files
	// this is basically magic
	await exec.exec("git", [
		"clone",
		`https://github.com/sveltejs/${target_repo}.git`,
		"--no-checkout",
		"--branch",
		target_branch,
		"--single-branch",
		tmp_dir_name,
		"--depth",
		"1",
		"--verbose",
	]);

	process.chdir(tmp_dir_name);

	await exec.exec("git", ["sparse-checkout", "init"]);

	// we only care about the documentation folder and any package readmes + package.jsons
	// await exec.exec("echo", [, ">", ".git/info/sparse-checkout"]);
	fs.writeFileSync(
		path.join(process.cwd(), ".git/info/sparse-checkout"),
		`/documentation/\n/packages/*/README.md\n/packages/*/package.json"`
	);
	await exec.exec("git", ["sparse-checkout", "reapply"]);
	await exec.exec("git", ["switch", target_branch]);
}

async function run() {
	// we may need this for branch deploys when we figure that out
	const type = core.getInput("type");
	const target_repo = core.getInput("repo");
	const target_branch = core.getInput("branch");
	const token = core.getInput("token");

	// const tmp_dir_name = `__tmp_${target_branch}`;

	try {
		await get_repo(target_branch);
	} catch (e) {
		console.log(e.message);
		throw e;
	}
	// console.log(type, "\n", target_repo, "\n", base_dir);
	// // console.log(JSON.stringify(github, null, 2));

	// const octokit = github.getOctokit(token);
	// const files = await get_files_from_repo(octokit, target_repo, base_dir);

	// const categories = {};
	// const sorted = files.forEach((arr) => {
	// 	const type = find_type(arr, base);
	// 	console.log(type);

	// 	if (categories[type]) categories[type].push(arr);
	// 	else categories[type] = [arr];
	// }, {});

	// console.log(categories);

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
