/**
 * Plugin that provides a command to clear the editor
 */
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
	CLEAR_EDITOR_COMMAND,
	COMMAND_PRIORITY_EDITOR,
	$getRoot,
	$createParagraphNode
} from "lexical";

export default function ClearEditorPlugin() {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		return editor.registerCommand(
			CLEAR_EDITOR_COMMAND,
			() => {
				editor.update(() => {
					const root = $getRoot();
					root.clear();
					root.append($createParagraphNode());
				});
				return true;
			},
			COMMAND_PRIORITY_EDITOR
		);
	}, [editor]);

	return null;
}
