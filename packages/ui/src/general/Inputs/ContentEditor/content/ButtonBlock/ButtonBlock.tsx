"use client";

import React from "react";
import { ContentBlock } from "../../ContentEditor";
import "./styles.scss";

interface ButtonBlockProps {
	block: ContentBlock;
	onUpdate: (updates: Partial<ContentBlock>) => void;
}

export default function ButtonBlock({ block, onUpdate }: ButtonBlockProps) {
	const alignment = block.config?.alignment || "center";
	const buttonText = block.config?.buttonText || "Click me";

	return (
		<div className={`button-block alignment-${alignment}`}>
			<button type="button" className="button-block-btn">
				{buttonText}
			</button>
		</div>
	);
}
