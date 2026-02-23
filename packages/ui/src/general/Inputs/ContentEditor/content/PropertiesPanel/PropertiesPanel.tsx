"use client";

import { set } from "lodash";
import { ContentBlock } from "../../ContentEditor";
import { ImagePanel, TextPanel, ButtonPanel, LayoutPanel } from "./components";
import { useCallback } from "react";

interface PropertiesPanelProps {
	selectedBlock: ContentBlock | null;
	onBlockUpdate: (id: string, updates: Partial<ContentBlock>) => void;
}

export default function PropertiesPanel({
	selectedBlock,
	onBlockUpdate
}: PropertiesPanelProps) {
	if (!selectedBlock) {
		return (
			<div className="content-editor-properties">
				<div className="properties-empty">
					<p>
						wähle einen Block um seine Eigenschaften zu bearbeiten
					</p>
				</div>
			</div>
		);
	}

	const handleUpdate = useCallback(
		(field: string, value: string) => {
			if (field && value) {
				set(selectedBlock, field, value) as Partial<ContentBlock>;
				onBlockUpdate(selectedBlock.id, selectedBlock);
			} else {
				console.error("Invalid field or value", field, value);
			}
		},
		[selectedBlock, onBlockUpdate]
	);

	return (
		<div className="content-editor-properties">
			<div className="properties-header">
				<h3>Eigenschaften</h3>
			</div>

			<div className="properties-content">
				<div className="property-group">
					<label className="property-label">
						Block Name (Block-Name)
					</label>
					<input
						type="text"
						className="property-input"
						value={selectedBlock.name}
						onChange={(e) => handleUpdate("name", e.target.value)}
					/>
				</div>

				<div className="property-group">
					<label className="property-label">Aktiv</label>
					<input
						type="checkbox"
						className="property-checkbox"
						checked={selectedBlock.active}
						onChange={(e) =>
							handleUpdate("active", e.target.checked.toString())
						}
					/>
				</div>

				{selectedBlock.type === "text" && (
					<>
						<TextPanel
							key={selectedBlock.id}
							value={selectedBlock.value as string}
							onChange={(value) => handleUpdate("value", value)}
						/>
					</>
				)}

				{selectedBlock.type === "button" && (
					<>
						<ButtonPanel
							selectedBlock={selectedBlock}
							onChange={(key: string, value: string) =>
								handleUpdate(key, value)
							}
						/>
					</>
				)}

				{selectedBlock.type === "image" && (
					<ImagePanel
						selectedBlock={selectedBlock}
						onChange={(key: string, value: string) =>
							handleUpdate(key, value)
						}
					/>
				)}

				{selectedBlock.type === "layout" && (
					<LayoutPanel
						selectedBlock={selectedBlock}
						onChange={(key: string, value: string) =>
							handleUpdate(key, value)
						}
					/>
				)}
			</div>
		</div>
	);
}
