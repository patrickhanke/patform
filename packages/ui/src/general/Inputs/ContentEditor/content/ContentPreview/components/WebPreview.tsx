import React from "react";
import { ContentBlock } from "../../../ContentEditor";
import { transformToWeb } from "../functions/transformToWeb";
import "./WebPreview.scss";

interface WebPreviewProps {
	content: ContentBlock[];
}

const WebPreview: React.FC<WebPreviewProps> = ({ content }) => {
	return (
		<div className="web-preview">
			<div className="web-preview-container">
				{transformToWeb(content)}
			</div>
		</div>
	);
};

export default WebPreview;
