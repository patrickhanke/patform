"use client";

import React, { useRef, useEffect } from "react";
import { ContentBlock } from "../../ContentEditor";
import "./styles.scss";

interface TextBlockProps {
	block: ContentBlock;
}

export default function TextBlock({ block }: TextBlockProps) {
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (contentRef.current && block.value) {
			contentRef.current.innerHTML = block.value as string;
		}
	}, []);

	return (
		<div className="text-block">
			<div
				className="text-block-content"
				dangerouslySetInnerHTML={{ __html: block.value as string }}
			/>
		</div>
	);
}
