import React, { FC } from "react";
import { ContentElementProps } from "./types";

const ContentElement: FC<ContentElementProps> = ({ content }) => {
	return (
		<div className="content_element">
			<p>{content.name}</p>
		</div>
	);
};

export default ContentElement;
