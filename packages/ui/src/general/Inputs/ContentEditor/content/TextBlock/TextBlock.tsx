"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { ContentBlock } from "../../ContentEditor";
import { getTextKind, getTextTypographyStyle } from "../../utils/textBlock";
import {
	registerTextEditor,
	saveTextEditorSelection
} from "../../utils/textEditorSelection";
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
	const containerStyle = { ...resolvedStyle };
	delete containerStyle.color;

	const commitValue = useCallback(() => {
		const html = contentRef.current?.innerHTML ?? "";
		if (html !== block.value) {
			onUpdate?.({ value: html });
		}
	}, [block.value, onUpdate]);

	useEffect(() => {
		const root = contentRef.current;
		if (!root) return;

		return registerTextEditor(block.id, root, (html) => {
			onUpdate?.({ value: html });
		});
	}, [block.id, onUpdate]);

	useEffect(() => {
		const root = contentRef.current;
		if (!root) return;

		const saveSelection = () => {
			if (!focusedRef.current) return;
			saveTextEditorSelection(block.id);
		};

		const onSelectionChange = () => {
			if (!focusedRef.current) return;
			const selection = window.getSelection();
			if (!selection || selection.rangeCount === 0) return;
			if (!root.contains(selection.anchorNode)) return;
			saveTextEditorSelection(block.id);
		};

		root.addEventListener("mouseup", saveSelection);
		root.addEventListener("keyup", saveSelection);
		document.addEventListener("selectionchange", onSelectionChange);

		return () => {
			root.removeEventListener("mouseup", saveSelection);
			root.removeEventListener("keyup", saveSelection);
			document.removeEventListener("selectionchange", onSelectionChange);
		};
	}, [block.id]);

	useEffect(() => {
		const node = contentRef.current;
		if (!node || focusedRef.current) return;
		const next = (block.value as string) || "";
		if (node.innerHTML !== next) {
			node.innerHTML = next;
		}
	}, [block.value]);

	return (
		<div
			className={`text-block text-block--${kind}${
				block.config?.fontSize ? " has-custom-size" : ""
			}`}
			style={{
				...getTextTypographyStyle(block.config),
				...containerStyle
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
				onBlur={() => {
					saveTextEditorSelection(block.id);
					focusedRef.current = false;
					commitValue();
				}}
				onInput={commitValue}
				onPointerDown={(event) => event.stopPropagation()}
			/>
		</div>
	);
}
