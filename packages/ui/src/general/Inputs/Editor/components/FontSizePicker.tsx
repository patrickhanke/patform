"use client";

import React, { useRef, useState } from "react";
import { Editor } from "@tiptap/react";
import { useOnClickOutside } from "usehooks-ts";
import { RiFontSize } from "react-icons/ri";

import "./FontSizePicker.scss";

const PRESET_SIZES = [
	"10px",
	"12px",
	"14px",
	"16px",
	"18px",
	"20px",
	"24px",
	"32px"
];

type FontSizePickerProps = {
	editor: Editor;
};

function FontSizePicker({ editor }: FontSizePickerProps) {
	const [isOpen, setIsOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const currentSize = editor.getAttributes("textStyle").fontSize as
		| string
		| undefined;
	const hasFontSize = !!currentSize;

	useOnClickOutside(ref, () => setIsOpen(false));

	const applySize = (size: string) => {
		editor.chain().focus().setFontSize(size).run();
		setIsOpen(false);
	};

	const handleUnset = () => {
		editor.chain().focus().unsetFontSize().run();
		setIsOpen(false);
	};

	return (
		<div
			className={`editor-font-size-picker${isOpen ? " is-open" : ""}`}
			ref={ref}
		>
			<div
				className={`editor-font-size-trigger${hasFontSize ? " active" : ""}`}
				onClick={() => setIsOpen((open) => !open)}
				title="Font size"
			>
				<RiFontSize />
			</div>
			{isOpen && (
				<div className="editor-font-size-popover">
					<button
						type="button"
						className={`editor-font-size-option${!hasFontSize ? " selected" : ""}`}
						onClick={handleUnset}
					>
						Default
					</button>
					{PRESET_SIZES.map((size) => (
						<button
							key={size}
							type="button"
							className={`editor-font-size-option${currentSize === size ? " selected" : ""}`}
							onClick={() => applySize(size)}
						>
							<span
								className="editor-font-size-option-preview"
								style={{ fontSize: size }}
							>
								{size}
							</span>
						</button>
					))}
				</div>
			)}
		</div>
	);
}

export default FontSizePicker;
