import React, { useState } from "react";
import { ContentBlock, Modal, SlideIn } from "@repo/ui";
import WebPreview from "./components/WebPreview";
import EmailPreview from "./components/EmailPreview";
import "./ContentPreview.scss";

type PreviewType = "web" | "email";

const ContentPreview = ({
	content,
	isOpen,
	setIsOpen
}: {
	content: ContentBlock[];
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}) => {
	const [previewType, setPreviewType] = useState<PreviewType>("web");

	return (
		<Modal
			header="Vorschau"
			isOpen={isOpen}
			cancelButtonHandler={() => setIsOpen(false)}
			styles={{ width: "800px" }}
			// confirmButtonHandler={() => setIsOpen(false)}
		>
			<div className="content-preview">
				<div className="content-preview-tabs">
					<button
						className={`preview-tab ${previewType === "web" ? "active" : ""}`}
						onClick={() => setPreviewType("web")}
					>
						<span className="tab-icon">🌐</span>
						<span className="tab-label">Website</span>
					</button>
					<button
						className={`preview-tab ${previewType === "email" ? "active" : ""}`}
						onClick={() => setPreviewType("email")}
					>
						<span className="tab-icon">📧</span>
						<span className="tab-label">E-Mail</span>
					</button>
				</div>

				<div className="content-preview-body">
					{previewType === "web" ? (
						<WebPreview content={content} />
					) : (
						<EmailPreview content={content} />
					)}
				</div>
			</div>
		</Modal>
	);
};

export default ContentPreview;
