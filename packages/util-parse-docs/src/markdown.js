import * as fleece from "golden-fleece";

export const RE_FRONTMATTER = /---\r?\n([\s\S]+?)\r?\n---/;

export function extract_frontmatter(markdown) {
	const match = RE_FRONTMATTER.exec(markdown);
	const frontMatter = match[1];
	const content = markdown.slice(match[0].length);

	const metadata = {};
	frontMatter.split("\n").forEach((pair) => {
		const colonIndex = pair.indexOf(":");
		metadata[pair.slice(0, colonIndex).trim()] = pair
			.slice(colonIndex + 1)
			.trim();
	});

	// reset regex
	RE_FRONTMATTER.lastIndex = 0;

	return { metadata, content };
}

// TODO: this never runs and is uneeded
export function extract_metadata(line, lang) {
	try {
		if (lang === "html" && line.startsWith("<!--") && line.endsWith("-->")) {
			return fleece.evaluate(line.slice(4, -3).trim());
		}

		if (
			lang === "js" ||
			(lang === "json" && line.startsWith("/*") && line.endsWith("*/"))
		) {
			return fleece.evaluate(line.slice(2, -2).trim());
		}
	} catch (err) {
		// TODO report these errors, don't just squelch them
		return null;
	}
}

// links renderer
export function link_renderer(href, title, text) {
	let target_attr = "";
	let title_attr = "";

	if (href.startsWith("http")) {
		target_attr = ' target="_blank"';
	}

	if (title !== null) {
		title_attr = ` title="${title}"`;
	}

	return `<a href="${href}"${target_attr}${title_attr} rel="noopener noreferrer">${text}</a>`;
}
