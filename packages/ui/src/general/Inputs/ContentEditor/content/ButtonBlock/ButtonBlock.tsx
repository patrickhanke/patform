"use client";

import React from "react";
import { ContentBlock } from "../../ContentEditor";
import {
	buttonPaddingAndFontSize,
	DEFAULT_BUTTON_BACKGROUND,
	DEFAULT_BUTTON_FONT_COLOR
} from "./buttonBlockStyles";
import "./styles.scss";

interface ButtonBlockProps {
	block: ContentBlock;
	onUpdate: (updates: Partial<ContentBlock>) => void;
}

export default function ButtonBlock({ block }: ButtonBlockProps) {
	const alignment = block.config?.alignment || "center";
	const buttonText = block.config?.buttonText || "Click me";
	const bg =
		block.config?.buttonBackgroundColor || DEFAULT_BUTTON_BACKGROUND;
	const color = block.config?.buttonFontColor || DEFAULT_BUTTON_FONT_COLOR;
	const { padding, fontSize } = buttonPaddingAndFontSize(
		block.config?.buttonSize
	);

	return (
		<div className={`button-block alignment-${alignment}`}>
			<button
				type="button"
				className="button-block-btn"
				style={{
					backgroundColor: bg,
					color,
					padding,
					fontSize
				}}
			>
				{buttonText}
			</button>
		</div>
	);
}
