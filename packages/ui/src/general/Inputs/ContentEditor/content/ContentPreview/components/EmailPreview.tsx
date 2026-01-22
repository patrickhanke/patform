import React, { useState } from "react";
import { ContentBlock } from "../../../ContentEditor";
import { transformToEmail } from "../functions/transformToEmail";
import { copyEmailHtml, downloadEmailHtml } from "../functions/exportEmail";
import "./EmailPreview.scss";

interface EmailPreviewProps {
	content: ContentBlock[];
}

const EmailPreview: React.FC<EmailPreviewProps> = ({ content }) => {
	const emailHtml = transformToEmail(content);
	const [copySuccess, setCopySuccess] = useState(false);

	const handleCopy = async () => {
		const success = await copyEmailHtml(content);
		if (success) {
			setCopySuccess(true);
			setTimeout(() => setCopySuccess(false), 2000);
		}
	};

	const handleDownload = () => {
		downloadEmailHtml(content);
	};

	return (
		<div className="email-preview">
			<div className="email-preview-header">
				<div className="header-left">
					<span className="preview-label">Email Preview</span>
					<span className="preview-info">
						Width: 600px (Standard Email Width)
					</span>
				</div>
				<div className="header-actions">
					<button
						className="action-button"
						onClick={handleCopy}
						title="HTML-Code kopieren"
					>
						{copySuccess ? "✓ Kopiert!" : "📋 HTML kopieren"}
					</button>
					<button
						className="action-button"
						onClick={handleDownload}
						title="HTML-Datei herunterladen"
					>
						⬇ Herunterladen
					</button>
				</div>
			</div>
			<div className="email-preview-container">
				<iframe
					srcDoc={emailHtml}
					title="Email Preview"
					className="email-preview-iframe"
					sandbox="allow-same-origin"
				/>
			</div>
		</div>
	);
};

export default EmailPreview;
