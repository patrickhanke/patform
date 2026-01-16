import { useCallback, useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
	$getSelection,
	$isRangeSelection,
	COMMAND_PRIORITY_CRITICAL,
	SELECTION_CHANGE_COMMAND
} from "lexical";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { mergeRegister } from "@lexical/utils";
import "./FloatingLinkEditorPlugin.scss";

function getSelectedNode(selection: any) {
	const anchor = selection.anchor;
	const focus = selection.focus;
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

export default function FloatingLinkEditorPlugin() {
	const [editor] = useLexicalComposerContext();
	const [isEditMode, setIsEditMode] = useState(false);
	const [linkUrl, setLinkUrl] = useState("");
	const [isLink, setIsLink] = useState(false);
	const editorRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const updateLinkEditor = useCallback(() => {
		editor.read(() => {
			const selection = $getSelection();
			if ($isRangeSelection(selection)) {
				const node = getSelectedNode(selection);
				const parent = node.getParent();
				if ($isLinkNode(parent)) {
					setLinkUrl(parent.getURL());
					setIsLink(true);
				} else if ($isLinkNode(node)) {
					setLinkUrl(node.getURL());
					setIsLink(true);
				} else {
					setLinkUrl("");
					setIsLink(false);
				}
			}
		});
	}, [editor]);

	useEffect(() => {
		return mergeRegister(
			editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				() => {
					updateLinkEditor();
					return false;
				},
				COMMAND_PRIORITY_CRITICAL
			)
		);
	}, [editor, updateLinkEditor]);

	useEffect(() => {
		if (isEditMode && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isEditMode]);

	const handleLinkSubmit = () => {
		if (linkUrl !== "") {
			editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
		}
		setIsEditMode(false);
	};

	const handleLinkRemove = () => {
		editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
		setIsEditMode(false);
		setLinkUrl("");
	};

	if (!isLink) {
		return null;
	}

	return (
		<div className="floating-link-editor" ref={editorRef}>
			{isEditMode ? (
				<div className="link-edit-mode">
					<input
						ref={inputRef}
						type="text"
						value={linkUrl}
						onChange={(e) => setLinkUrl(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								handleLinkSubmit();
							} else if (e.key === "Escape") {
								e.preventDefault();
								setIsEditMode(false);
							}
						}}
						placeholder="Enter URL"
					/>
					<button type="button" onClick={handleLinkSubmit}>
						✓
					</button>
					<button type="button" onClick={() => setIsEditMode(false)}>
						✕
					</button>
				</div>
			) : (
				<div className="link-view-mode">
					<a
						href={linkUrl}
						target="_blank"
						rel="noopener noreferrer"
					>
						{linkUrl}
					</a>
					<button
						type="button"
						onClick={() => setIsEditMode(true)}
						aria-label="Edit link"
					>
						✎
					</button>
					<button
						type="button"
						onClick={handleLinkRemove}
						aria-label="Remove link"
					>
						🗑
					</button>
				</div>
			)}
		</div>
	);
}
