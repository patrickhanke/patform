"use client";

import { useState } from "react";
import type { ContentBlock } from "../../../ContentEditor";
import ImportContentModal, {
	type ImportedContentRef
} from "../../ImportContentModal/ImportContentModal";

const ContentPanel = ({
	selectedBlock,
	onChange
}: {
	selectedBlock: ContentBlock;
	onChange: (updates: Partial<ContentBlock>) => void;
}) => {
	const [isOpen, setIsOpen] = useState(false);

	const applyContent = (content: ImportedContentRef) => {
		onChange({
			name: content.title || "Inhaltselement",
			value: content.objectId,
			config: {
				...selectedBlock.config,
				contentTitle: content.title,
				contentType: content.type,
				contentId: content.content_id
			}
		});
	};

	return (
		<div className="property-group">
			<label className="property-label">Inhaltselement</label>
			<div className="content-panel-summary">
				{selectedBlock.value ? (
					<>
						<p>
							<strong>
								{selectedBlock.config?.contentTitle ||
									selectedBlock.name}
							</strong>
						</p>
						<p className="content-panel-meta">
							{selectedBlock.config?.contentType}
							{selectedBlock.config?.contentId
								? ` · ${selectedBlock.config.contentId}`
								: ""}
						</p>
						<p className="content-panel-meta">
							objectId: {String(selectedBlock.value)}
						</p>
					</>
				) : (
					<p className="content-panel-meta">Kein Element verknüpft</p>
				)}
			</div>
			<button
				type="button"
				className="property-select content-panel-button"
				onClick={() => setIsOpen(true)}
			>
				{selectedBlock.value ? "Element ändern" : "Element wählen"}
			</button>
			<ImportContentModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				onImport={applyContent}
			/>
		</div>
	);
};

export default ContentPanel;
