/**
 * Layout Plugin - Multi-column layouts
 */
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodeToNearestRoot } from "@lexical/utils";
import {
	$createParagraphNode,
	$getSelection,
	$isRangeSelection,
	COMMAND_PRIORITY_EDITOR,
	createCommand,
	LexicalCommand
} from "lexical";

import {
	$createLayoutContainerNode,
	$isLayoutContainerNode,
	LayoutContainerNode
} from "../nodes/LayoutContainerNode";
import {
	$createLayoutItemNode,
	LayoutItemNode
} from "../nodes/LayoutItemNode";

export const INSERT_LAYOUT_COMMAND: LexicalCommand<string> = createCommand(
	"INSERT_LAYOUT_COMMAND"
);

export default function LayoutPlugin() {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		if (!editor.hasNodes([LayoutContainerNode, LayoutItemNode])) {
			throw new Error(
				"LayoutPlugin: LayoutContainerNode or LayoutItemNode not registered on editor"
			);
		}

		return editor.registerCommand(
			INSERT_LAYOUT_COMMAND,
			(template: string) => {
				const selection = $getSelection();

				if (!$isRangeSelection(selection)) {
					return false;
				}

				// Create layout container
				const container = $createLayoutContainerNode(template);

				// Parse template to count columns (e.g., "1fr 1fr" = 2 columns)
				const columns = template.split(" ").length;

				// Create layout items (columns)
				for (let i = 0; i < columns; i++) {
					const layoutItem = $createLayoutItemNode();
					layoutItem.append($createParagraphNode());
					container.append(layoutItem);
				}

				// Insert the layout container
				$insertNodeToNearestRoot(container);

				// Focus first column
				container.selectStart();

				return true;
			},
			COMMAND_PRIORITY_EDITOR
		);
	}, [editor]);

	return null;
}
