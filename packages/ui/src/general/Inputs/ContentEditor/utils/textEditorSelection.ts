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
			document.execCommand("bold", false);
			break;
		case "italic":
			document.execCommand("italic", false);
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
