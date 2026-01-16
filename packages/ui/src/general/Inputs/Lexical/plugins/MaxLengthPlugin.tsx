/**
 * Plugin to limit maximum character count
 */
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $trimTextContentFromAnchor } from "@lexical/selection";
import { $restoreEditorState } from "@lexical/utils";
import { $getSelection, $isRangeSelection, EditorState, RootNode } from "lexical";

export interface MaxLengthPluginProps {
	maxLength: number;
}

export default function MaxLengthPlugin({ maxLength }: MaxLengthPluginProps) {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		let lastRestoredEditorState: EditorState | null = null;

		return editor.registerNodeTransform(RootNode, (rootNode: RootNode) => {
			const selection = $getSelection();
			if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
				return;
			}
			const prevEditorState = editor.getEditorState();
			const prevTextContentSize = prevEditorState.read(() =>
				rootNode.getTextContentSize()
			);
			const textContentSize = rootNode.getTextContentSize();
			
			if (prevTextContentSize !== textContentSize) {
				const delCount = textContentSize - maxLength;
				const anchor = selection.anchor;

				if (delCount > 0) {
					// Restore the old editor state if at limit
					if (
						prevTextContentSize === maxLength &&
						lastRestoredEditorState !== prevEditorState
					) {
						lastRestoredEditorState = prevEditorState;
						$restoreEditorState(editor, prevEditorState);
					} else {
						$trimTextContentFromAnchor(editor, anchor, delCount);
					}
				}
			}
		});
	}, [editor, maxLength]);

	return null;
}
