import resolve from "@rollup/plugin-node-resolve";
import cjs from "@rollup/plugin-commonjs";

export default {
	input: "src/index.js",
	plugins: [resolve(), cjs()],
	output: { file: "dist/index.js", format: "cjs" },
};
