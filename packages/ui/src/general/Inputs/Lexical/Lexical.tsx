"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
	HeadingNode,
	QuoteNode,
	$createHeadingNode,
	$createQuoteNode
} from "@lexical/rich-text";
import {
	ListItemNode,
	ListNode,
	INSERT_ORDERED_LIST_COMMAND,
	INSERT_UNORDERED_LIST_COMMAND,
	INSERT_CHECK_LIST_COMMAND,
	REMOVE_LIST_COMMAND
} from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { AutoLinkNode, LinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin";
import { HashtagNode } from "@lexical/hashtag";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import { MarkNode } from "@lexical/mark";
import {
	$getRoot,
	$getSelection,
	$isRangeSelection,
	$createParagraphNode,
	FORMAT_TEXT_COMMAND,
	SELECTION_CHANGE_COMMAND,
	COMMAND_PRIORITY_CRITICAL,
	INDENT_CONTENT_COMMAND,
	OUTDENT_CONTENT_COMMAND
} from "lexical";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $setBlocksType } from "@lexical/selection";
import {
	INSERT_HORIZONTAL_RULE_COMMAND
} from "@lexical/react/LexicalHorizontalRuleNode";

import FloatingLinkEditorPlugin from "./plugins/FloatingLinkEditorPlugin";
import FloatingTextFormatToolbarPlugin from "./plugins/FloatingTextFormatToolbarPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import MaxLengthPlugin from "./plugins/MaxLengthPlugin";
import CharacterCountPlugin from "./plugins/CharacterCountPlugin";
import ClearEditorPlugin from "./plugins/ClearEditorPlugin";
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import AutoFocusPlugin from "./plugins/AutoFocusPlugin";
import InsertMenuPlugin from "./plugins/InsertMenuPlugin";
import ImagesPlugin from "./plugins/ImagesPlugin";
import PageBreakPlugin from "./plugins/PageBreakPlugin";
import TablePlugin from "./plugins/TablePlugin";

import { ImageNode } from "./nodes/ImageNode";
import { PageBreakNode } from "./nodes/PageBreakNode";
import { LayoutContainerNode } from "./nodes/LayoutContainerNode";
import { LayoutItemNode } from "./nodes/LayoutItemNode";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import LayoutPlugin from "./plugins/LayoutPlugin";

import "./Lexical.scss";

// URL matchers for AutoLinkPlugin
const URL_MATCHER =
	/((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const EMAIL_MATCHER =
	/(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

const MATCHERS = [
	(text: string) => {
		const match = URL_MATCHER.exec(text);
		if (match === null) {
			return null;
		}
		const fullMatch = match[0];
		return {
			index: match.index,
			length: fullMatch.length,
			text: fullMatch,
			url: fullMatch.startsWith("http") ? fullMatch : `https://${fullMatch}`
		};
	},
	(text: string) => {
		const match = EMAIL_MATCHER.exec(text);
		if (match === null) {
			return null;
		}
		const fullMatch = match[0];
		return {
			index: match.index,
			length: fullMatch.length,
			text: fullMatch,
			url: `mailto:${fullMatch}`
		};
	}
];

// Plugin to update editor when value prop changes
function UpdatePlugin({ value }: { value: string }) {
	const [editor] = useLexicalComposerContext();
	const isFirstRender = useRef(true);
	const previousValueRef = useRef<string>("");

	useEffect(() => {
		// On first render, initialize with the value if provided
		if (isFirstRender.current && value) {
			isFirstRender.current = false;
			previousValueRef.current = value;

			editor.update(() => {
				const parser = new DOMParser();
				const dom = parser.parseFromString(value, "text/html");
				const nodes = $generateNodesFromDOM(editor, dom);
				const root = $getRoot();
				root.clear();

				if (nodes.length > 0) {
					root.append(...nodes);
				}
			});
			return;
		}

		isFirstRender.current = false;

		// On subsequent updates, only update if value has changed externally
		if (value && value !== previousValueRef.current) {
			previousValueRef.current = value;

			editor.update(() => {
				const currentHtml = $generateHtmlFromNodes(editor, null);

				// Only update if the incoming value is different from current editor content
				if (value !== currentHtml) {
					const parser = new DOMParser();
					const dom = parser.parseFromString(value, "text/html");
					const nodes = $generateNodesFromDOM(editor, dom);
					const root = $getRoot();
					root.clear();

					if (nodes.length > 0) {
						root.append(...nodes);
					}
				}
			});
		}
	}, [value, editor]);

	return null;
}

// Plugin to handle disabled state
function DisabledPlugin({ disabled }: { disabled: boolean }) {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		editor.setEditable(!disabled);
	}, [disabled, editor]);

	return null;
}

// Toolbar component
function Toolbar() {
	const [editor] = useLexicalComposerContext();
	const [isBold, setIsBold] = useState(false);
	const [isItalic, setIsItalic] = useState(false);
	const [isUnderline, setIsUnderline] = useState(false);
	const [isStrikethrough, setIsStrikethrough] = useState(false);
	const [isCode, setIsCode] = useState(false);
	const [blockType] = useState("paragraph");
	const [isLink, setIsLink] = useState(false);

	const updateToolbar = useCallback(() => {
		editor.read(() => {
			const selection = $getSelection();
			if ($isRangeSelection(selection)) {
				setIsBold(selection.hasFormat("bold"));
				setIsItalic(selection.hasFormat("italic"));
				setIsUnderline(selection.hasFormat("underline"));
				setIsStrikethrough(selection.hasFormat("strikethrough"));
				setIsCode(selection.hasFormat("code"));
				
				// Check if selection is within a link
				const node = selection.anchor.getNode();
				const parent = node.getParent();
				setIsLink(
					parent !== null && 
					parent.getType() === "link"
				);
			}
		});
	}, [editor]);

	useEffect(() => {
		return editor.registerCommand(
			SELECTION_CHANGE_COMMAND,
			() => {
				updateToolbar();
				return false;
			},
			COMMAND_PRIORITY_CRITICAL
		);
	}, [editor, updateToolbar]);

	const formatText = (
		format: "bold" | "italic" | "underline" | "strikethrough" | "code"
	) => {
		editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
	};

	const formatHeading = (headingTag: "h1" | "h2" | "h3") => {
		if (blockType !== headingTag) {
			editor.update(() => {
				const selection = $getSelection();
				if ($isRangeSelection(selection)) {
					$setBlocksType(selection, () =>
						$createHeadingNode(headingTag)
					);
				}
			});
		} else {
			editor.update(() => {
				const selection = $getSelection();
				if ($isRangeSelection(selection)) {
					$setBlocksType(selection, () => $createParagraphNode());
				}
			});
		}
	};

	const formatQuote = () => {
		if (blockType !== "quote") {
			editor.update(() => {
				const selection = $getSelection();
				if ($isRangeSelection(selection)) {
					$setBlocksType(selection, () => $createQuoteNode());
				}
			});
		} else {
			editor.update(() => {
				const selection = $getSelection();
				if ($isRangeSelection(selection)) {
					$setBlocksType(selection, () => $createParagraphNode());
				}
			});
		}
	};

	const insertBulletList = () => {
		if (blockType !== "bullet") {
			editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
		} else {
			editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
		}
	};

	const insertNumberedList = () => {
		if (blockType !== "number") {
			editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
		} else {
			editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
		}
	};

	const insertCheckList = () => {
		editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
	};

	const insertLink = () => {
		if (!isLink) {
			editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
		} else {
			editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
		}
	};

	const insertHorizontalRule = () => {
		editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
	};

	const indentContent = () => {
		editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
	};

	const outdentContent = () => {
		editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
	};

	return (
		<div className="lexical-toolbar">
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
				onClick={() => formatHeading("h1")}
				className={blockType === "h1" ? "active" : ""}
				aria-label="Heading 1"
			>
				H1
			</button>
			<button
				type="button"
				onClick={() => formatHeading("h2")}
				className={blockType === "h2" ? "active" : ""}
				aria-label="Heading 2"
			>
				H2
			</button>
			<button
				type="button"
				onClick={() => formatHeading("h3")}
				className={blockType === "h3" ? "active" : ""}
				aria-label="Heading 3"
			>
				H3
			</button>
			<div className="toolbar-divider" />
			<button
				type="button"
				onClick={() => formatQuote()}
				className={blockType === "quote" ? "active" : ""}
				aria-label="Quote"
			>
				&quot; Quote
			</button>
			<div className="toolbar-divider" />
			<button
				type="button"
				onClick={insertBulletList}
				className={blockType === "bullet" ? "active" : ""}
				aria-label="Bulleted List"
			>
				• List
			</button>
			<button
				type="button"
				onClick={insertNumberedList}
				className={blockType === "number" ? "active" : ""}
				aria-label="Numbered List"
			>
				1. List
			</button>
			<button
				type="button"
				onClick={insertCheckList}
				aria-label="Check List"
			>
				☑ Checklist
			</button>
			<div className="toolbar-divider" />
			<button
				type="button"
				onClick={outdentContent}
				aria-label="Outdent"
			>
				← Outdent
			</button>
			<button
				type="button"
				onClick={indentContent}
				aria-label="Indent"
			>
				→ Indent
			</button>
			<div className="toolbar-divider" />
			<button
				type="button"
				onClick={insertLink}
				className={isLink ? "active" : ""}
				aria-label="Insert Link"
			>
				🔗 Link
			</button>
			<button
				type="button"
				onClick={insertHorizontalRule}
				aria-label="Horizontal Rule"
			>
				─ HR
			</button>
		</div>
	);
}

// OnChange handler plugin with debouncing
function OnChangeHandlerPlugin({
	onChange
}: {
	onChange?: (html: string) => void;
}) {
	const [editor] = useLexicalComposerContext();
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		return editor.registerUpdateListener(
			({ dirtyElements, dirtyLeaves }) => {
				// Only trigger onChange if there are actual content changes
				const hasContentChanges =
					dirtyElements.size > 0 || dirtyLeaves.size > 0;

				if (hasContentChanges && onChange) {
					if (timeoutRef.current) {
						clearTimeout(timeoutRef.current);
					}

					timeoutRef.current = setTimeout(() => {
						editor.getEditorState().read(() => {
							const html = $generateHtmlFromNodes(editor, null);
							onChange(html);
						});
					}, 300); // Debounce for 300ms
				}
			}
		);
	}, [editor, onChange]);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return null;
}

export interface LexicalEditorProps {
	value?: string;
	onChange?: (html: string) => void;
	disabled?: boolean;
	placeholder?: string;
	withToolbar?: boolean;
	withFloatingToolbar?: boolean;
	withCodeHighlight?: boolean;
	withCharacterCount?: boolean;
	withTreeView?: boolean;
	withInsertMenu?: boolean;
	autoFocus?: boolean;
	maxLength?: number;
	className?: string;
}

export default function LexicalEditor({
	value = "",
	onChange,
	disabled = false,
	placeholder = "Enter some text...",
	withToolbar = true,
	withFloatingToolbar = false,
	withCodeHighlight = true,
	withCharacterCount = false,
	withTreeView = false,
	withInsertMenu = false,
	autoFocus = false,
	maxLength,
	className = ""
}: LexicalEditorProps) {
	const initialConfig = {
		namespace: "LexicalEditor",
		theme: {
			paragraph: "lexical-paragraph",
			text: {
				bold: "lexical-text-bold",
				italic: "lexical-text-italic",
				underline: "lexical-text-underline",
				strikethrough: "lexical-text-strikethrough",
				code: "lexical-text-code"
			},
			heading: {
				h1: "lexical-heading-h1",
				h2: "lexical-heading-h2",
				h3: "lexical-heading-h3",
				h4: "lexical-heading-h4",
				h5: "lexical-heading-h5",
				h6: "lexical-heading-h6"
			},
			list: {
				ul: "lexical-list-ul",
				ol: "lexical-list-ol",
				listitem: "lexical-list-item",
				listitemChecked: "lexical-list-item-checked",
				listitemUnchecked: "lexical-list-item-unchecked",
				checklist: "lexical-checklist",
				nested: {
					listitem: "lexical-nested-list-item"
				}
			},
			link: "lexical-link",
			code: "lexical-code",
			quote: "lexical-quote",
			hashtag: "lexical-hashtag",
			mark: "lexical-mark",
			hr: "lexical-hr",
			layoutContainer: "lexical-layout-container",
			layoutItem: "lexical-layout-item"
		},
		onError: (error: Error) => {
			console.error("Lexical Error:", error);
		},
		nodes: [
			HeadingNode,
			ListNode,
			ListItemNode,
			QuoteNode,
			CodeNode,
			CodeHighlightNode,
			AutoLinkNode,
			LinkNode,
			HorizontalRuleNode,
			HashtagNode,
			MarkNode,
			ImageNode,
			PageBreakNode,
			TableNode,
			TableCellNode,
			TableRowNode,
			LayoutContainerNode,
			LayoutItemNode
		],
		editable: !disabled
	};

	return (
		<div
			className={`lexical-editor-container ${className} ${disabled ? "disabled" : ""}`}
		>
			<LexicalComposer initialConfig={initialConfig}>
				<div className="lexical-toolbar-row">
					{withToolbar && <Toolbar />}
					{withInsertMenu && <InsertMenuPlugin />}
				</div>
				<div className="lexical-editor-wrapper">
					<RichTextPlugin
						contentEditable={
							<ContentEditable
								className="lexical-content-editable"
								aria-placeholder={placeholder}
								placeholder={
									<div className="lexical-placeholder">
										{placeholder}
									</div>
								}
							/>
						}
						ErrorBoundary={() => <div>An error occurred</div>}
					/>
					<HistoryPlugin />
					<ListPlugin />
					<CheckListPlugin />
					<LinkPlugin />
					<AutoLinkPlugin matchers={MATCHERS} />
					<ClickableLinkPlugin disabled={disabled} />
					<FloatingLinkEditorPlugin />
					{withFloatingToolbar && <FloatingTextFormatToolbarPlugin />}
					{withCodeHighlight && <CodeHighlightPlugin />}
					<TabIndentationPlugin />
					<HorizontalRulePlugin />
					<MarkdownShortcutPlugin />
					<HashtagPlugin />
					<ClearEditorPlugin />
					<ImagesPlugin />
					<PageBreakPlugin />
					<TablePlugin />
					<LayoutPlugin />
					{maxLength && <MaxLengthPlugin maxLength={maxLength} />}
					{withCharacterCount && <CharacterCountPlugin maxLength={maxLength} />}
					{autoFocus && <AutoFocusPlugin />}
					<OnChangeHandlerPlugin onChange={onChange} />
					<UpdatePlugin value={value} />
					<DisabledPlugin disabled={disabled} />
				</div>
			</LexicalComposer>
			{withTreeView && (
				<LexicalComposer initialConfig={initialConfig}>
					<TreeViewPlugin />
				</LexicalComposer>
			)}
		</div>
	);
}
