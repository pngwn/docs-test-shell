import { suite } from "uvu";
import * as assert from "uvu/assert";

import fs from "fs";

import { transform_api } from "./format_api.js";

import api from "../fixtures/api-docs-markdown.js";
import api_output from "../fixtures/api-docs-html.js";

const format = suite("transform docs");

// const lines = (arr) => arr.split("\n").map((s) => s.trim());

format("formats the api docs", () => {
	const output = transform_api("./api-docs.md", api);

	assert.equal(output, output);
});

format.run();
