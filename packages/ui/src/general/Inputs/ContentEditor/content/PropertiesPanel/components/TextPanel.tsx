import React from "react";
import { Editor } from "@repo/ui";

const TextPanel = ({
	value,
	onChange
}: {
	value: string;
	onChange: (value: string) => void;
}) => {
	return (
		<div className="property-group">
			<Editor
				content={value}
				onChange={onChange}
				withPopover
				withHexColorsDecorator
			/>
		</div>
	);
};

export default TextPanel;
