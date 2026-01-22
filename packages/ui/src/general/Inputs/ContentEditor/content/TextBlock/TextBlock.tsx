"use client";

import React, { useRef, useEffect } from "react";
import { ContentBlock } from "../../ContentEditor";
import "./styles.scss";

interface TextBlockProps {
	block: ContentBlock;
	onUpdate: (updates: Partial<ContentBlock>) => void;
}

export default function TextBlock({ block, onUpdate }: TextBlockProps) {
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (contentRef.current && block.value) {
			contentRef.current.innerHTML = block.value as string;
		}
	}, []);

	const handleInput = () => {
		if (contentRef.current) {
			const newValue = contentRef.current.innerHTML;
			onUpdate({ value: newValue });
		}
	};

	const handleBlur = () => {
		if (contentRef.current) {
			const newValue = contentRef.current.innerHTML;
			onUpdate({ value: newValue });
		}
	};

	return (
		<div className="text-block">
			<div dangerouslySetInnerHTML={{ __html: block.value as string }} />
		</div>
	);
}
