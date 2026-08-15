"use client";

import { ContentBlock } from "../../ContentEditor";
import "./styles.scss";

interface ContentReferenceBlockProps {
	block: ContentBlock;
}

export default function ContentReferenceBlock({
	block
}: ContentReferenceBlockProps) {
	const title = block.config?.contentTitle || block.name || "Inhaltselement";
	const contentType = block.config?.contentType || "content";
	const contentId = block.config?.contentId;
	const objectId = typeof block.value === "string" ? block.value : "";

	return (
		<div className="content-reference-block">
			<div className="content-reference-block-icon">⧉</div>
			<div className="content-reference-block-body">
				<div className="content-reference-block-title">{title}</div>
				<div className="content-reference-block-meta">
					<span className="content-reference-block-type">
						{contentType}
					</span>
					{contentId && (
						<span className="content-reference-block-id">
							ID: {contentId}
						</span>
					)}
					{objectId && (
						<span className="content-reference-block-ref">
							ref: {objectId}
						</span>
					)}
				</div>
				<p className="content-reference-block-hint">
					Wird auf der Website über objectId geladen
				</p>
			</div>
		</div>
	);
}
