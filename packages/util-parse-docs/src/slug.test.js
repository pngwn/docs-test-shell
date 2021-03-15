import { suite } from "uvu";
import * as assert from "uvu/assert";

import { urlsafeSlugProcessor, unicodeSafeProcessor } from "./slug.js";

const url_safe = suite("urlsafeSlugProcessor");
const unicode_safe = suite("unicodeSafeProcessor");

url_safe("ascii: space separated words", () => {
	assert.equal(urlsafeSlugProcessor("Text expressions"), `Text_expressions`);
});

url_safe("ascii: numbered text", () => {
	assert.equal(urlsafeSlugProcessor("1. export creates"), `1_export_creates`);
});

url_safe("ascii: punctuated text", () => {
	assert.equal(urlsafeSlugProcessor("svelte.VERSION"), `svelte_VERSION`);
});

url_safe("ascii: text starting with the dollar sign", () => {
	assert.equal(urlsafeSlugProcessor("$destroy method"), `$destroy_method`);
});

url_safe("ascii: numbered text containing the dollar sign", () => {
	assert.equal(urlsafeSlugProcessor("1. export $destroy"), `1_export_$destroy`);
});

url_safe("ascii: text containing the equal char", () => {
	assert.equal(
		urlsafeSlugProcessor("script context=module"),
		`script_context_module`
	);
});

url_safe("ascii: text containing the colon char", () => {
	assert.equal(urlsafeSlugProcessor("svelte:body"), `svelte_body`);
});

url_safe("ascii: text containing the slash char", () => {
	assert.equal(urlsafeSlugProcessor("svelte/motion"), `svelte_motion`);
});

url_safe("ascii: text containing the comma char", () => {
	assert.equal(urlsafeSlugProcessor("svelte, motion"), `svelte_motion`);
});

url_safe("unicode: should translate symbols to English", () => {
	assert.equal(urlsafeSlugProcessor("Ich ♥ Deutsch"), `Ich_love_Deutsch`);
});

url_safe("unicode: should remove emoji", () => {
	assert.equal(urlsafeSlugProcessor("Ich 😍 Deutsch"), `Ich_Deutsch`);
});

url_safe("cyrillic: space separated words", () => {
	assert.equal(
		urlsafeSlugProcessor("Всплытие и перехват событий"),
		`Vsplytie_i_perehvat_sobytij`
	);
});

url_safe("cyrillic: numbered text", () => {
	assert.equal(
		urlsafeSlugProcessor("1 Всплытие и перехват событий"),
		`1_Vsplytie_i_perehvat_sobytij`
	);
});

url_safe("cyrillic: punctuated text", () => {
	assert.equal(
		urlsafeSlugProcessor(".Всплытие.и.перехват событий"),
		`Vsplytie_i_perehvat_sobytij`
	);
});

url_safe("cyrillic: text starting with the dollar sign", () => {
	assert.equal(
		urlsafeSlugProcessor("$Всплытие $ перехват событий"),
		`$Vsplytie_$_perehvat_sobytij`
	);
});

url_safe("cyrillic: text containing the dollar sign", () => {
	assert.equal(urlsafeSlugProcessor("Всплытие$перехват"), `Vsplytie$perehvat`);
});

url_safe("cyrillic: text containing the equal char", () => {
	assert.equal(
		urlsafeSlugProcessor("Всплытие = перехват=событий"),
		`Vsplytie_perehvat_sobytij`
	);
});

url_safe("cyrillic: text containing the colon char", () => {
	assert.equal(
		urlsafeSlugProcessor("Всплытие : перехват:событий"),
		`Vsplytie_perehvat_sobytij`
	);
});

url_safe("cyrillic: text containing the slash char", () => {
	assert.equal(
		urlsafeSlugProcessor("Всплытие / перехват/событий"),
		`Vsplytie_perehvat_sobytij`
	);
});

url_safe("cyrillic: text containing the comma char", () => {
	assert.equal(urlsafeSlugProcessor("Всплытие, перехват"), `Vsplytie_perehvat`);
});

url_safe("ascii + cyrillic: space separated words", () => {
	assert.equal(
		urlsafeSlugProcessor("Всплытие и export перехват событий"),
		`Vsplytie_i_export_perehvat_sobytij`
	);
});

url_safe(
	"ascii + cyrillic: ascii word concatenated to a cyricllic word",
	() => {
		assert.equal(urlsafeSlugProcessor("exportВсплытие"), "exportVsplytie");
	}
);

url_safe(
	"ascii + cyrillic: cyricllic word concatenated to an ascii word",
	() => {
		assert.equal(urlsafeSlugProcessor("Всплытиеexport"), `Vsplytieexport`);
	}
);

url_safe("ascii + cyrillic: numbered text", () => {
	assert.equal(
		urlsafeSlugProcessor("1 export Всплытие и перехват событий"),
		`1_export_Vsplytie_i_perehvat_sobytij`
	);
});

url_safe("ascii + cyrillic: punctuated text", () => {
	assert.equal(
		urlsafeSlugProcessor(".Всплытие.export.и.перехват событий"),
		`Vsplytie_export_i_perehvat_sobytij`
	);
});

url_safe(
	"ascii + cyrillic: text starting with the dollar sign, followed by ascii char",
	() => {
		assert.equal(
			urlsafeSlugProcessor("$exportВсплытие перехват событий"),
			`$exportVsplytie_perehvat_sobytij`
		);
	}
);

url_safe(
	"ascii + cyrillic: text starting with the dollar sign, followed by unicode char",
	() => {
		assert.equal(
			urlsafeSlugProcessor("$Всплытие export перехват событий"),
			`$Vsplytie_export_perehvat_sobytij`
		);
	}
);

url_safe(
	"ascii + cyrillic: text containing the dollar sign, followed by ascii char",
	() => {
		assert.equal(
			urlsafeSlugProcessor(
				"export $destroy a component prop Всплытие и перехват событий"
			),
			`export_$destroy_a_component_prop_Vsplytie_i_perehvat_sobytij`
		);
	}
);

url_safe(
	"ascii + cyrillic: text containing the dollar sign, followed by unicode char",
	() => {
		assert.equal(
			urlsafeSlugProcessor(
				"Всплытие export $Всплытие a component prop Всплытие и перехват событий"
			),
			`Vsplytie_export_$Vsplytie_a_component_prop_Vsplytie_i_perehvat_sobytij`
		);
	}
);

url_safe("ascii + cyrillic: text containing the equal char", () => {
	assert.equal(
		urlsafeSlugProcessor("script context=module Всплытие=и перехват событий"),
		`script_context_module_Vsplytie_i_perehvat_sobytij`
	);
});

url_safe("ascii + cyrillic: text containing the colon char", () => {});
assert.equal(
	urlsafeSlugProcessor("svelte:body Всплытие и:перехват событий"),
	`svelte_body_Vsplytie_i_perehvat_sobytij`
);

url_safe("ascii + cyrillic: text containing the slash char", () => {
	assert.equal(
		urlsafeSlugProcessor("svelte/motion Всплытие и / перехват/событий"),
		`svelte_motion_Vsplytie_i_perehvat_sobytij`
	);
});

url_safe("ascii + cyrillic: text containing the comma char", () => {
	assert.equal(urlsafeSlugProcessor("Всплытие, export"), `Vsplytie_export`);
});

unicode_safe("ascii: space separated words", () => {
	assert.equal(unicodeSafeProcessor("Text expressions"), `Text_expressions`);
});

unicode_safe("ascii: numbered text", () => {
	assert.equal(unicodeSafeProcessor("1. export creates"), `1_export_creates`);
});

unicode_safe("ascii: punctuated text", () => {
	assert.equal(unicodeSafeProcessor("svelte.VERSION"), `svelte_VERSION`);
});

unicode_safe("ascii: text starting with the dollar sign", () => {
	assert.equal(unicodeSafeProcessor("$destroy method"), `$destroy_method`);
});

unicode_safe("ascii: numbered text containing the dollar sign", () => {
	assert.equal(unicodeSafeProcessor("1. export $destroy"), `1_export_$destroy`);
});

unicode_safe("ascii: text containing the equal char", () => {
	assert.equal(
		unicodeSafeProcessor("script context=module"),
		`script_context_module`
	);
});

unicode_safe("ascii: text containing the colon char", () => {
	assert.equal(unicodeSafeProcessor("svelte:body"), `svelte_body`);
});

unicode_safe("ascii: text containing the slash char", () => {
	assert.equal(unicodeSafeProcessor("svelte/motion"), `svelte_motion`);
});

unicode_safe("ascii: text containing the comma char", () => {
	assert.equal(unicodeSafeProcessor("svelte, motion"), `svelte_motion`);
});

unicode_safe("unicode: should preserve symbols", () => {
	assert.equal(unicodeSafeProcessor("Ich ♥ Deutsch"), `Ich_love_Deutsch`);
});

unicode_safe("unicode: should remove emoji", () => {
	assert.equal(unicodeSafeProcessor("Ich 😍 Deutsch"), `Ich_Deutsch`);
});

unicode_safe("cyricllic: space separated words", () => {
	assert.equal(
		unicodeSafeProcessor("Всплытие и перехват событий"),
		`Всплытие_и_перехват_событий`
	);
});

unicode_safe("cyricllic: numbered text", () => {
	assert.equal(
		unicodeSafeProcessor("1 Всплытие и перехват событий"),
		`1_Всплытие_и_перехват_событий`
	);
});

unicode_safe("cyricllic: punctuated text", () => {
	assert.equal(
		unicodeSafeProcessor(".Всплытие.и.перехват событий"),
		`Всплытие_и_перехват_событий`
	);
});

unicode_safe("cyricllic: text starting with the dollar sign", () => {
	assert.equal(
		unicodeSafeProcessor("$Всплытие $ перехват событий"),
		`$_Всплытие_$_перехват_событий`
	);
});

unicode_safe("cyricllic: text containing the dollar sign", () => {
	assert.equal(
		unicodeSafeProcessor("Всплытие$перехват"),
		`Всплытие_$_перехват`
	);
});

unicode_safe("cyricllic: text containing the equal char", () => {
	assert.equal(
		unicodeSafeProcessor("Всплытие = перехват=событий"),
		`Всплытие_перехват_событий`
	);
});

unicode_safe("cyricllic: text containing the colon char", () => {
	assert.equal(
		unicodeSafeProcessor("Всплытие : перехват:событий"),
		`Всплытие_перехват_событий`
	);
});

unicode_safe("cyricllic: text containing the slash char", () => {
	assert.equal(
		unicodeSafeProcessor("Всплытие / перехват/событий"),
		`Всплытие_перехват_событий`
	);
});

unicode_safe("cyricllic: text containing the comma char", () => {
	assert.equal(unicodeSafeProcessor("Всплытие, перехват"), `Всплытие_перехват`);
});

unicode_safe("ascii + cyricllic: space separated words", () => {
	assert.equal(
		unicodeSafeProcessor("Всплытие и export перехват событий"),
		`Всплытие_и_export_перехват_событий`
	);
});

unicode_safe(
	"ascii + cyricllic: ascii word concatenated to a cyricllic word",
	() => {
		assert.equal(unicodeSafeProcessor("exportВсплытие"), `export_Всплытие`);
	}
);

unicode_safe(
	"ascii + cyricllic: cyricllic word concatenated to an ascii word",
	() => {
		assert.equal(unicodeSafeProcessor("Всплытиеexport"), `Всплытие_export`);
	}
);

unicode_safe("ascii + cyricllic: numbered text", () => {
	assert.equal(
		unicodeSafeProcessor("1 export Всплытие и перехват событий"),
		`1_export_Всплытие_и_перехват_событий`
	);
});

unicode_safe("ascii + cyricllic: punctuated text", () => {
	assert.equal(
		unicodeSafeProcessor(".Всплытие.export.и.перехват событий"),
		`Всплытие_export_и_перехват_событий`
	);
});

unicode_safe(
	"ascii + cyricllic: text starting with the dollar sign, followed by ascii char",
	() => {
		assert.equal(
			unicodeSafeProcessor("$exportВсплытие перехват событий"),
			`$export_Всплытие_перехват_событий`
		);
	}
);

unicode_safe(
	"ascii + cyricllic: text starting with the dollar sign, followed by unicode char",
	() => {
		assert.equal(
			unicodeSafeProcessor("$Всплытие export перехват событий"),
			`$_Всплытие_export_перехват_событий`
		);
	}
);

unicode_safe(
	"ascii + cyricllic: text containing the dollar sign, followed by ascii char",
	() => {
		assert.equal(
			unicodeSafeProcessor(
				"export $destroy a component prop Всплытие и перехват событий"
			),
			`export_$destroy_a_component_prop_Всплытие_и_перехват_событий`
		);
	}
);

unicode_safe(
	"ascii + cyricllic: text containing the dollar sign, followed by unicode char",
	() => {
		assert.equal(
			unicodeSafeProcessor(
				"Всплытие export $Всплытие a component prop Всплытие и перехват событий"
			),
			`Всплытие_export_$_Всплытие_a_component_prop_Всплытие_и_перехват_событий`
		);
	}
);

unicode_safe("ascii + cyricllic: text containing the equal char", () => {
	assert.equal(
		unicodeSafeProcessor("script context=module Всплытие=и перехват событий"),
		`script_context_module_Всплытие_и_перехват_событий`
	);
});

unicode_safe("ascii + cyricllic: ext containing the colon char", () => {
	assert.equal(
		unicodeSafeProcessor("svelte:body Всплытие и:перехват событий"),
		`svelte_body_Всплытие_и_перехват_событий`
	);
});

unicode_safe("ascii + cyricllic: text containing the slash char", () => {
	assert.equal(
		unicodeSafeProcessor("svelte/motion Всплытие и / перехват/событий"),
		`svelte_motion_Всплытие_и_перехват_событий`
	);
});

unicode_safe("ascii + cyricllic: text containing the comma char", () => {
	assert.equal(unicodeSafeProcessor("Всплытие, export"), `Всплытие_export`);
});

unicode_safe.run();
url_safe.run();
