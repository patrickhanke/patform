"use client";

import React, { useEffect, useRef } from "react";
import { ContentBlock } from "../../ContentEditor";
import { getTextKind, getTextTypographyStyle } from "../../utils/textBlock";
import { resolveBlockStyle } from "../../styles";
import "./styles.scss";

interface TextBlockProps {
	block: ContentBlock;
	onUpdate?: (updates: Partial<ContentBlock>) => void;
}

export default function TextBlock({ block, onUpdate }: TextBlockProps) {
	const contentRef = useRef<HTMLDivElement>(null);
	const focusedRef = useRef(false);
	const kind = getTextKind(block);
	const { style: resolvedStyle } = resolveBlockStyle(block.style, {
		includeSizing: false,
		includeColors: true
	});

	useEffect(() => {
		const node = contentRef.current;
		if (!node || focusedRef.current) return;
		const next = (block.value as string) || "";
		if (node.innerHTML !== next) {
			node.innerHTML = next;
		}
	}, [block.value]);

	const commitValue = () => {
		focusedRef.current = false;
		const html = contentRef.current?.innerHTML ?? "";
		if (html !== block.value) {
			onUpdate?.({ value: html });
		}
	};

	return (
		<div
			className={`text-block text-block--${kind}${
				block.config?.fontSize ? " has-custom-size" : ""
			}`}
			style={{
				...getTextTypographyStyle(block.config),
				...resolvedStyle
			}}
		>
			<div
				ref={contentRef}
				className="text-block-content"
				contentEditable
				suppressContentEditableWarning
				role="textbox"
				aria-label={block.name}
				onFocus={() => {
					focusedRef.current = true;
				}}
				onBlur={commitValue}
				onPointerDown={(event) => event.stopPropagation()}
			/>
		</div>
	);
}
