// import fs from "fs";
// import path from "path";

import marked from "marked";

import { SLUG_PRESERVE_UNICODE, SLUG_SEPARATOR } from "./config.js";
import {
	extract_frontmatter,
	extract_metadata,
	link_renderer,
} from "./markdown.js";

import { make_session_slug_processor } from "./slug.js";
import { highlight } from "./highlight.js";

const blockTypes = [
	"blockquote",
	"html",
	"heading",
	"hr",
	"list",
	"listitem",
	"paragraph",
	"table",
	"tablerow",
	"tablecell",
];

const make_slug = make_session_slug_processor({
	preserve_unicode: SLUG_PRESERVE_UNICODE,
	separator: SLUG_SEPARATOR,
});

// export default function get_sections() {
// TODO: remove - this module not touch the FS
// return fs
// 	.readdirSync(`${process.cwd()}/docs/api`)
// 	.filter((file) => file[0] !== "." && path.extname(file) === ".md")
// 	.map((file) => {
// 		const markdown = fs.readFileSync(
// 			`${process.cwd()}/docs/api/${file}`,
// 			"utf-8"
// 		);
export function transform_api(file, markdown) {
	// THIS IS WHERE IT BEGINS
	let prev_level = 3;
	const { content, metadata } = extract_frontmatter(markdown);

	const section_slug = make_slug(metadata.title);

	const sections = [];
	let section_stack = [sections];

	const renderer = new marked.Renderer();

	let block_open = false;

	renderer.link = link_renderer;

	renderer.hr = () => {
		block_open = true;

		return '<div class="side-by-side"><div class="copy">';
	};

	renderer.code = (source, lang) => {
		source = source.replace(/^ +/gm, (match) => match.split("    ").join("\t"));

		const lines = source.split("\n");

		// TODO: this is always null | undefined
		const meta = extract_metadata(lines[0], lang);

		// TODO: without the meta block these values never change
		let prefix = "";
		let className = "code-block";

		// TODO: this path is never taken
		if (meta) {
			source = lines.slice(1).join("\n");
			const filename = meta.filename || (lang === "html" && "App.svelte");
			if (filename) {
				prefix = `<span class='filename'>${prefix} ${filename}</span>`;
				className += " named";
			}
		}

		// TODO:
		if (meta && meta.hidden) return "";

		const html = `<div class='${className}'>${prefix}${highlight(
			source,
			lang
		)}</div>`;

		if (block_open) {
			block_open = false;
			return `</div><div class="code">${html}</div></div>`;
		}

		return html;
	};

	renderer.heading = (text, level, rawtext) => {
		let slug;

		const match = /<a href="([^"]+)"[^>]*>(.+)<\/a>/.exec(text);
		if (match) {
			slug = match[1];
			text = match[2];
		} else {
			slug = make_slug(rawtext);
		}

		if (level === 3 || level === 4) {
			// TODO: code never executed - it was for the svelte 2 docs
			const title = text
				.replace(/<\/?code>/g, "")
				.replace(/\.(\w+)(\((.+)?\))?/, (m, $1, $2, $3) => {
					if ($3) return `.${$1}(...)`;
					if ($2) return `.${$1}()`;
					return `.${$1}`;
				});

			const prev_section = section_stack[section_stack.length - 1];

			if (level > prev_level) {
				section_stack.push(
					prev_section[prev_section.length - 1].sections || []
				);
			} else if (level < prev_level) {
				section_stack.pop();
			}

			section_stack[section_stack.length - 1].push({
				slug,
				title,
				sections: [],
			});
			prev_level = level;
		}

		return `
					<h${level}>
						<span id="${slug}" class="offset-anchor" ${
			level > 4 ? "data-scrollignore" : ""
		}></span>
						<a href="docs#${slug}" class="anchor" aria-hidden="true"></a>
						${text}
					</h${level}>`;
	};

	blockTypes.forEach((type) => {
		const fn = renderer[type];
		renderer[type] = function () {
			return fn.apply(this, arguments);
		};
	});

	const html = marked(content, { renderer });

	const hashes = {};

	return {
		content: html.replace(/@@(\d+)/g, (m, id) => hashes[id] || m),
		title: metadata.title,
		slug: section_slug,
		file,
		sections,
	};
}

// console.log(JSON.stringify(transform_api(), null, 2));
