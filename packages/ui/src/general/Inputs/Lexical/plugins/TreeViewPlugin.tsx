/**
 * Plugin to show the lexical tree structure for debugging
 */
import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TreeView } from "@lexical/react/LexicalTreeView";
import "./TreeViewPlugin.scss";

export default function TreeViewPlugin() {
	const [editor] = useLexicalComposerContext();
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div className="tree-view-plugin">
			<button
				type="button"
				className="tree-view-toggle"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				{isExpanded ? "Hide" : "Show"} Tree View
			</button>
			{isExpanded && (
				<div className="tree-view-content">
					<TreeView
						viewClassName="tree-view"
						timeTravelPanelClassName="time-travel-panel"
						timeTravelButtonClassName="time-travel-button"
						timeTravelPanelSliderClassName="time-travel-slider"
						timeTravelPanelButtonClassName="time-travel-panel-button"
						editor={editor}
					/>
				</div>
			)}
		</div>
	);
}
