/**
 * Page Break Plugin - Handle page break insertions
 */
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
	$insertNodes,
	COMMAND_PRIORITY_EDITOR,
	createCommand,
	LexicalCommand
} from "lexical";
import { $createPageBreakNode } from "../nodes/PageBreakNode";

export const INSERT_PAGE_BREAK: LexicalCommand<void> = createCommand(
	"INSERT_PAGE_BREAK"
);

export default function PageBreakPlugin() {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		return editor.registerCommand(
			INSERT_PAGE_BREAK,
			() => {
				const pageBreakNode = $createPageBreakNode();
				$insertNodes([pageBreakNode]);
				return true;
			},
			COMMAND_PRIORITY_EDITOR
		);
	}, [editor]);

	return null;
}
