"use client";

import React from "react";
import { ContentBlock } from "../../ContentEditor";
import "./styles.scss";

interface DividerBlockProps {
	block: ContentBlock;
}

export default function DividerBlock({ block }: DividerBlockProps) {
	return (
		<div className="divider-block">
			<hr className="divider-block-line" />
		</div>
	);
}
