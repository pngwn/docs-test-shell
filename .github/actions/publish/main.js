import github from "@actions/github";
import core from "@actions/core";

function run() {
	const type = core.getInput("type");
	const docs = core.getInput("docs");
	console.log(type, "\n", docs);
	console.log(JSON.stringify(github, null, 2));

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
