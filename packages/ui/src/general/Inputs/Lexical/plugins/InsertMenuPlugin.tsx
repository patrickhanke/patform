/**
 * Insert Menu Plugin - Provides access to all insert options
 */
import { useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import { INSERT_IMAGE_COMMAND } from "./ImagesPlugin";
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
	const [showMenu, setShowMenu] = useState(false);
	const [showColumnsSubmenu, setShowColumnsSubmenu] = useState(false);

	const insertHorizontalRule = () => {
		editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
		setShowMenu(false);
	};

	const insertTable = () => {
		editor.dispatchCommand(INSERT_TABLE_COMMAND, {
			columns: "3",
			rows: "3",
			includeHeaders: true
		});
		setShowMenu(false);
	};

	const insertImage = () => {
		const url = prompt("Enter image URL:");
		if (url) {
			editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
				src: url,
				altText: "Image"
			});
		}
		setShowMenu(false);
	};

	const insertPageBreak = () => {
		editor.dispatchCommand(INSERT_PAGE_BREAK, undefined);
		setShowMenu(false);
	};

	const insertYouTube = () => {
		const url = prompt("Enter YouTube URL:");
		if (url) {
			editor.dispatchCommand(INSERT_YOUTUBE_COMMAND as any, url);
		}
		setShowMenu(false);
	};

	const insertEquation = () => {
		const equation = prompt("Enter LaTeX equation:");
		if (equation) {
			editor.dispatchCommand(INSERT_EQUATION_COMMAND as any, {
				equation,
				inline: false
			});
		}
		setShowMenu(false);
	};

	const insertColumns = (template: string) => {
		editor.dispatchCommand(INSERT_LAYOUT_COMMAND, template);
		setShowMenu(false);
		setShowColumnsSubmenu(false);
	};

	return (
		<div className="insert-menu-container">
			<button
				type="button"
				className="insert-menu-button"
				onClick={() => setShowMenu(!showMenu)}
			>
				+ Insert
			</button>
			{showMenu && (
				<div className="insert-menu-dropdown">
					<button
						type="button"
						className="insert-menu-item"
						onClick={insertHorizontalRule}
					>
						<span className="icon">—</span>
						<span>Horizontal Rule</span>
					</button>
					<button
						type="button"
						className="insert-menu-item"
						onClick={insertPageBreak}
					>
						<span className="icon">📄</span>
						<span>Page Break</span>
					</button>
					<button
						type="button"
						className="insert-menu-item"
						onClick={insertImage}
					>
						<span className="icon">🖼️</span>
						<span>Image</span>
					</button>
					<button
						type="button"
						className="insert-menu-item"
						onClick={insertTable}
					>
						<span className="icon">📊</span>
						<span>Table</span>
					</button>
					<button
						type="button"
						className="insert-menu-item"
						onClick={insertYouTube}
					>
						<span className="icon">▶️</span>
						<span>YouTube Video</span>
					</button>
					<button
						type="button"
						className="insert-menu-item"
						onClick={insertEquation}
					>
						<span className="icon">∑</span>
						<span>Equation</span>
					</button>
					<div className="insert-menu-divider" />
					<button
						type="button"
						className="insert-menu-item insert-menu-item-with-submenu"
						onMouseEnter={() => setShowColumnsSubmenu(true)}
						onMouseLeave={() => setShowColumnsSubmenu(false)}
					>
						<span className="icon">⚏</span>
						<span>Columns Layout</span>
						<span className="arrow">›</span>
						{showColumnsSubmenu && (
							<div 
								className="insert-menu-submenu"
								onMouseEnter={() => setShowColumnsSubmenu(true)}
								onMouseLeave={() => setShowColumnsSubmenu(false)}
							>
								{COLUMN_LAYOUTS.map((layout) => (
									<button
										key={layout.value}
										type="button"
										className="insert-menu-item"
										onClick={() => insertColumns(layout.value)}
									>
										<span>{layout.label}</span>
									</button>
								))}
							</div>
						)}
					</button>
					<div className="insert-menu-divider" />
					<button
						type="button"
						className="insert-menu-item"
						onClick={() => setShowMenu(false)}
					>
						<span>Close</span>
					</button>
				</div>
			)}
		</div>
	);
}
