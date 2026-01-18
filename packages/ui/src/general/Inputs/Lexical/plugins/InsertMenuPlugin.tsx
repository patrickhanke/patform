/**
 * Insert Menu Plugin - Provides access to all insert options
 */
import { useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import { INSERT_IMAGE_COMMAND, OPEN_IMAGE_SELECTOR_COMMAND } from "./ImagesPlugin";
import { INSERT_PAGE_BREAK } from "./PageBreakPlugin";
import { INSERT_LAYOUT_COMMAND } from "./LayoutPlugin";
import "./InsertMenuPlugin.scss";

export const INSERT_COLLAPSIBLE_COMMAND = "INSERT_COLLAPSIBLE";
export const INSERT_EQUATION_COMMAND = "INSERT_EQUATION";
export const INSERT_YOUTUBE_COMMAND = "INSERT_YOUTUBE";
export const INSERT_TWEET_COMMAND = "INSERT_TWEET";

// Column layout templates
const COLUMN_LAYOUTS = [
	{ label: "2 columns (equal)", value: "1fr 1fr" },
	{ label: "2 columns (25% / 75%)", value: "1fr 3fr" },
	{ label: "3 columns (equal)", value: "1fr 1fr 1fr" },
	{ label: "3 columns (25% / 50% / 25%)", value: "1fr 2fr 1fr" },
	{ label: "4 columns (equal)", value: "1fr 1fr 1fr 1fr" }
];

export default function InsertMenuPlugin() {
	const [editor] = useLexicalComposerContext();
	const [showColumnsMenu, setShowColumnsMenu] = useState(false);

	const insertHorizontalRule = () => {
		editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
	};

	const insertTable = () => {
		editor.dispatchCommand(INSERT_TABLE_COMMAND, {
			columns: "3",
			rows: "3",
			includeHeaders: true
		});
	};

	const insertImage = () => {
		editor.dispatchCommand(OPEN_IMAGE_SELECTOR_COMMAND, undefined);
	};

	const insertPageBreak = () => {
		editor.dispatchCommand(INSERT_PAGE_BREAK, undefined);
	};

	const insertYouTube = () => {
		const url = prompt("Enter YouTube URL:");
		if (url) {
			// YouTube command not yet implemented
			console.log("YouTube insert:", url);
		}
	};

	const insertEquation = () => {
		const equation = prompt("Enter LaTeX equation:");
		if (equation) {
			// Equation command not yet implemented
			console.log("Equation insert:", equation);
		}
	};

	const insertColumns = (template: string) => {
		editor.dispatchCommand(INSERT_LAYOUT_COMMAND, template);
		setShowColumnsMenu(false);
	};

	return (
		<div className="insert-menu-toolbar">
			<div className="divider" />

			<button
				type="button"
				className="toolbar-button"
				onClick={insertHorizontalRule}
				title="Insert Horizontal Rule"
			>
				—
			</button>

			<button
				type="button"
				className="toolbar-button"
				onClick={insertPageBreak}
				title="Insert Page Break"
			>
				📄
			</button>

			<button
				type="button"
				className="toolbar-button"
				onClick={insertImage}
				title="Insert Image"
			>
				🖼️
			</button>

			<button
				type="button"
				className="toolbar-button"
				onClick={insertTable}
				title="Insert Table"
			>
				📊
			</button>

			<div className="columns-dropdown">
				<button
					type="button"
					className="toolbar-button"
					onClick={() => setShowColumnsMenu(!showColumnsMenu)}
					title="Insert Columns Layout"
				>
					⚏ ▼
				</button>
				{showColumnsMenu && (
					<div className="columns-menu">
						{COLUMN_LAYOUTS.map((layout) => (
							<button
								key={layout.value}
								type="button"
								className="columns-menu-item"
								onClick={() => insertColumns(layout.value)}
							>
								{layout.label}
							</button>
						))}
					</div>
				)}
			</div>

			<button
				type="button"
				className="toolbar-button"
				onClick={insertYouTube}
				title="Insert YouTube Video"
			>
				▶️
			</button>

			<button
				type="button"
				className="toolbar-button"
				onClick={insertEquation}
				title="Insert Equation"
			>
				∑
			</button>
		</div>
	);
}
