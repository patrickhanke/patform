/**
 * Table Plugin - Wrapper for Lexical table functionality
 */
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import { TablePlugin as LexicalTablePlugin } from "@lexical/react/LexicalTablePlugin";

export default function TablePlugin() {
	return (
		<>
			<LexicalTablePlugin hasCellMerge hasCellBackgroundColor />
		</>
	);
}

export { INSERT_TABLE_COMMAND };
