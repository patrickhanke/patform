export type InlineFormatAction =
	| { type: "color"; value: string }
	| { type: "bold" }
	| { type: "italic" }
	| { type: "link"; url: string }
	| { type: "unlink" };

type TextEditorEntry = {
	root: HTMLElement;
	onCommit: (html: string) => void;
};

const editors = new Map<string, TextEditorEntry>();
const savedRanges = new Map<string, Range>();

export const registerTextEditor = (
	blockId: string,
	root: HTMLElement,
	onCommit: (html: string) => void
) => {
	editors.set(blockId, { root, onCommit });
	return () => {
		editors.delete(blockId);
		savedRanges.delete(blockId);
	};
};

export const saveTextEditorSelection = (blockId: string) => {
	const editor = editors.get(blockId);
	if (!editor) return;

	const selection = window.getSelection();
	if (!selection || selection.rangeCount === 0) return;

	const range = selection.getRangeAt(0);
	if (!editor.root.contains(range.commonAncestorContainer)) return;

	savedRanges.set(blockId, range.cloneRange());
};

const restoreSelection = (blockId: string): boolean => {
	const range = savedRanges.get(blockId);
	const editor = editors.get(blockId);
	if (!range || !editor) return false;

	const selection = window.getSelection();
	if (!selection) return false;

	selection.removeAllRanges();
	selection.addRange(range);
	return true;
};

const selectAllContent = (root: HTMLElement) => {
	const range = document.createRange();
	range.selectNodeContents(root);
	const selection = window.getSelection();
	selection?.removeAllRanges();
	selection?.addRange(range);
};

const ensureStyleWithCss = () => {
	try {
		document.execCommand("styleWithCSS", false, "true");
	} catch {
		// Unsupported in some browsers; execCommand still works.
	}
};

const ensureSemanticInlineCommands = () => {
	try {
		document.execCommand("styleWithCSS", false, "false");
	} catch {
		// Unsupported in some browsers; execCommand still works.
	}
};

const isBoldFontWeight = (fontWeight: string): boolean => {
	const value = fontWeight.trim().toLowerCase();
	if (value === "bold" || value === "bolder") return true;
	const numeric = Number.parseInt(value, 10);
	return !Number.isNaN(numeric) && numeric >= 700;
};

const isItalicFontStyle = (fontStyle: string): boolean =>
	fontStyle.trim().toLowerCase().includes("italic");

const isExplicitlyBold = (
	element: Element | null,
	root: HTMLElement
): boolean => {
	let current: Element | null = element;
	while (current && root.contains(current)) {
		if (current instanceof HTMLElement) {
			if (current.tagName === "B" || current.tagName === "STRONG") {
				return true;
			}
			if (
				current.style.fontWeight &&
				isBoldFontWeight(current.style.fontWeight)
			) {
				return true;
			}
		}
		current = current.parentElement;
	}
	return false;
};

const isExplicitlyItalic = (
	element: Element | null,
	root: HTMLElement
): boolean => {
	let current: Element | null = element;
	while (current && root.contains(current)) {
		if (current instanceof HTMLElement) {
			if (current.tagName === "I" || current.tagName === "EM") {
				return true;
			}
			if (
				current.style.fontStyle &&
				isItalicFontStyle(current.style.fontStyle)
			) {
				return true;
			}
		}
		current = current.parentElement;
	}
	return false;
};

export const applyInlineFormat = (
	blockId: string,
	action: InlineFormatAction
): boolean => {
	const editor = editors.get(blockId);
	if (!editor) return false;

	editor.root.focus();

	const restored = restoreSelection(blockId);
	const selection = window.getSelection();
	if (!selection) return false;

	if (!restored || selection.isCollapsed) {
		selectAllContent(editor.root);
	}

	ensureStyleWithCss();

	switch (action.type) {
		case "color":
			document.execCommand("foreColor", false, action.value);
			break;
		case "bold":
			ensureSemanticInlineCommands();
			document.execCommand("bold", false);
			ensureStyleWithCss();
			break;
		case "italic":
			ensureSemanticInlineCommands();
			document.execCommand("italic", false);
			ensureStyleWithCss();
			break;
		case "link":
			if (action.url.trim()) {
				document.execCommand("createLink", false, action.url.trim());
			}
			break;
		case "unlink":
			document.execCommand("unlink", false);
			break;
	}

	const html = editor.root.innerHTML;
	editor.onCommit(html);
	saveTextEditorSelection(blockId);
	return true;
};

export const hasTextEditor = (blockId: string) => editors.has(blockId);

export const normalizeCssColor = (color: string): string => {
	const value = color.trim();
	if (!value) return value;
	if (value.startsWith("#")) {
		if (value.length === 4) {
			return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
		}
		return value;
	}

	const rgbMatch = value.match(
		/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i
	);
	if (rgbMatch) {
		const r = Math.round(Number(rgbMatch[1]));
		const g = Math.round(Number(rgbMatch[2]));
		const b = Math.round(Number(rgbMatch[3]));
		const a = rgbMatch[4] !== undefined ? Number(rgbMatch[4]) : 1;
		const hex = `#${[r, g, b]
			.map((channel) => channel.toString(16).padStart(2, "0"))
			.join("")}`;
		if (a < 1) return `rgba(${r}, ${g}, ${b}, ${a})`;
		return hex;
	}

	return value;
};

const getActiveRange = (blockId: string): Range | undefined => {
	const editor = editors.get(blockId);
	if (!editor) return undefined;

	const selection = window.getSelection();
	if (selection?.rangeCount) {
		const liveRange = selection.getRangeAt(0);
		if (editor.root.contains(liveRange.commonAncestorContainer)) {
			return liveRange;
		}
	}

	return savedRanges.get(blockId);
};

const getElementAtRangeStart = (
	range: Range,
	root: HTMLElement
): Element | null => {
	const { startContainer, startOffset } = range;

	if (startContainer.nodeType === Node.TEXT_NODE) {
		const parent = startContainer.parentElement;
		return parent && root.contains(parent) ? parent : null;
	}

	if (
		!(startContainer instanceof Element) ||
		!root.contains(startContainer)
	) {
		return null;
	}

	const child = startContainer.childNodes[startOffset];
	if (child instanceof Element) return child;
	if (child?.nodeType === Node.TEXT_NODE && child.parentElement) {
		return child.parentElement;
	}

	const previous = startContainer.childNodes[startOffset - 1];
	if (previous instanceof Element) return previous;
	if (previous?.nodeType === Node.TEXT_NODE && previous.parentElement) {
		return previous.parentElement;
	}

	return startContainer;
};

const findExplicitInlineColor = (
	element: Element | null,
	root: HTMLElement
): string | null => {
	let current: Element | null = element;
	while (current && root.contains(current)) {
		if (current instanceof HTMLElement) {
			if (current.style.color) return current.style.color;
			if (current.tagName === "FONT") {
				const fontColor = current.getAttribute("color");
				if (fontColor) return fontColor;
			}
		}
		current = current.parentElement;
	}
	return null;
};

/** Color at the current (or last saved) selection/caret in a text block. */
export const getTextEditorSelectionColor = (blockId: string): string | null => {
	const editor = editors.get(blockId);
	if (!editor) return null;

	const range = getActiveRange(blockId);
	if (!range) return null;

	const element = getElementAtRangeStart(range, editor.root);
	const inlineColor = findExplicitInlineColor(element, editor.root);
	if (inlineColor) return normalizeCssColor(inlineColor);

	if (element) {
		return normalizeCssColor(getComputedStyle(element).color);
	}

	return normalizeCssColor(getComputedStyle(editor.root).color);
};

/** Whether the current (or last saved) selection is explicitly bold. */
export const getTextEditorSelectionBold = (blockId: string): boolean => {
	const editor = editors.get(blockId);
	if (!editor) return false;

	const range = getActiveRange(blockId);
	if (!range) return false;

	const element = getElementAtRangeStart(range, editor.root);
	if (isExplicitlyBold(element, editor.root)) return true;

	const active = document.activeElement;
	if (active === editor.root || editor.root.contains(active)) {
		try {
			return document.queryCommandState("bold");
		} catch {
			return false;
		}
	}

	return false;
};

/** Whether the current (or last saved) selection is explicitly italic. */
export const getTextEditorSelectionItalic = (blockId: string): boolean => {
	const editor = editors.get(blockId);
	if (!editor) return false;

	const range = getActiveRange(blockId);
	if (!range) return false;

	const element = getElementAtRangeStart(range, editor.root);
	if (isExplicitlyItalic(element, editor.root)) return true;

	const active = document.activeElement;
	if (active === editor.root || editor.root.contains(active)) {
		try {
			return document.queryCommandState("italic");
		} catch {
			return false;
		}
	}

	return false;
};
