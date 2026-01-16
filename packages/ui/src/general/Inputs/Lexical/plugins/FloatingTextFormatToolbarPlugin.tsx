/**
 * Floating toolbar that appears when text is selected
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
	$getSelection,
	$isRangeSelection,
	COMMAND_PRIORITY_LOW,
	FORMAT_TEXT_COMMAND,
	SELECTION_CHANGE_COMMAND
} from "lexical";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { mergeRegister } from "@lexical/utils";
import { createPortal } from "react-dom";
import "./FloatingTextFormatToolbarPlugin.scss";

function getSelectedNode(selection: any) {
	const anchor = selection.anchor;
	const anchorNode = selection.anchor.getNode();
	const focusNode = selection.focus.getNode();
	if (anchorNode === focusNode) {
		return anchorNode;
	}
	const isBackward = selection.isBackward();
	if (isBackward) {
		return $isRangeSelection(selection) ? focusNode : anchorNode;
	} else {
		return $isRangeSelection(selection) ? anchorNode : focusNode;
	}
}

export default function FloatingTextFormatToolbarPlugin() {
	const [editor] = useLexicalComposerContext();
	const [isBold, setIsBold] = useState(false);
	const [isItalic, setIsItalic] = useState(false);
	const [isUnderline, setIsUnderline] = useState(false);
	const [isStrikethrough, setIsStrikethrough] = useState(false);
	const [isCode, setIsCode] = useState(false);
	const [isLink, setIsLink] = useState(false);
	const [show, setShow] = useState(false);
	const toolbarRef = useRef<HTMLDivElement>(null);

	const updateToolbar = useCallback(() => {
		editor.read(() => {
			const selection = $getSelection();

			if ($isRangeSelection(selection)) {
				// Check if selection is not empty
				if (!selection.isCollapsed()) {
					setIsBold(selection.hasFormat("bold"));
					setIsItalic(selection.hasFormat("italic"));
					setIsUnderline(selection.hasFormat("underline"));
					setIsStrikethrough(selection.hasFormat("strikethrough"));
					setIsCode(selection.hasFormat("code"));

					const node = getSelectedNode(selection);
					const parent = node.getParent();
					setIsLink($isLinkNode(parent) || $isLinkNode(node));

					setShow(true);
					positionToolbar();
				} else {
					setShow(false);
				}
			} else {
				setShow(false);
			}
		});
	}, [editor]);

	const positionToolbar = () => {
		const domSelection = window.getSelection();
		const domRange =
			domSelection && domSelection.rangeCount > 0
				? domSelection.getRangeAt(0)
				: null;

		if (!domRange || !toolbarRef.current) return;

		const rangeRect = domRange.getBoundingClientRect();
		const toolbar = toolbarRef.current;

		toolbar.style.top = `${rangeRect.top - toolbar.offsetHeight - 10}px`;
		toolbar.style.left = `${rangeRect.left + rangeRect.width / 2 - toolbar.offsetWidth / 2}px`;
	};

	useEffect(() => {
		return mergeRegister(
			editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				() => {
					updateToolbar();
					return false;
				},
				COMMAND_PRIORITY_LOW
			),
			editor.registerUpdateListener(() => {
				updateToolbar();
			})
		);
	}, [editor, updateToolbar]);

	const formatText = (format: "bold" | "italic" | "underline" | "strikethrough" | "code") => {
		editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
	};

	const insertLink = () => {
		if (!isLink) {
			editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
		} else {
			editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
		}
	};

	if (!show) return null;

	return createPortal(
		<div ref={toolbarRef} className="floating-text-format-toolbar">
			<button
				type="button"
				onClick={() => formatText("bold")}
				className={isBold ? "active" : ""}
				aria-label="Format Bold"
			>
				<strong>B</strong>
			</button>
			<button
				type="button"
				onClick={() => formatText("italic")}
				className={isItalic ? "active" : ""}
				aria-label="Format Italic"
			>
				<em>I</em>
			</button>
			<button
				type="button"
				onClick={() => formatText("underline")}
				className={isUnderline ? "active" : ""}
				aria-label="Format Underline"
			>
				<u>U</u>
			</button>
			<button
				type="button"
				onClick={() => formatText("strikethrough")}
				className={isStrikethrough ? "active" : ""}
				aria-label="Format Strikethrough"
			>
				<s>S</s>
			</button>
			<button
				type="button"
				onClick={() => formatText("code")}
				className={isCode ? "active" : ""}
				aria-label="Format Code"
			>
				&lt;/&gt;
			</button>
			<div className="toolbar-divider" />
			<button
				type="button"
				onClick={insertLink}
				className={isLink ? "active" : ""}
				aria-label="Insert Link"
			>
				🔗
			</button>
		</div>,
		document.body
	);
}
