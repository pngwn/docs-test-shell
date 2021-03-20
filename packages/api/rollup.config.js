import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

export default {
	input: "index.js",
	plugins: [resolve()],
	output: {
		sourcemap: false,
		file: "dist/index.js",
	},
};
