"use client";

import React, { useRef, useState } from "react";
import { Editor } from "@tiptap/react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { useOnClickOutside } from "usehooks-ts";
import { RiFontColor } from "react-icons/ri";

import "./TextColorPicker.scss";

type TextColorPickerProps = {
	editor: Editor;
};

function TextColorPicker({ editor }: TextColorPickerProps) {
	const [isOpen, setIsOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const currentColor = editor.getAttributes("textStyle").color || "#000000";
	const hasColor = !!editor.getAttributes("textStyle").color;
	const displayColor =
		!currentColor || currentColor === "#000000" ? "#666666" : currentColor;

	useOnClickOutside(ref, () => setIsOpen(false));

	const handleColorChange = (color: string) => {
		editor.chain().focus().setColor(color).run();
	};

	const handleUnsetColor = () => {
		editor.chain().focus().unsetColor().run();
		setIsOpen(false);
	};

	return (
		<div className="editor-text-color-picker" ref={ref}>
			<div
				className={`editor-text-color-trigger${hasColor ? " active" : ""}`}
				onClick={() => setIsOpen((open) => !open)}
				title="Text color"
			>
				<RiFontColor
					style={{
						color: displayColor
					}}
				/>
			</div>
			{isOpen && (
				<div className="editor-text-color-popover">
					<HexColorPicker
						color={currentColor}
						onChange={handleColorChange}
					/>
					<div className="editor-text-color-input-row">
						<HexColorInput
							color={currentColor}
							onChange={handleColorChange}
							className="editor-text-color-input"
						/>
					</div>
					<button
						type="button"
						className="editor-text-color-reset"
						onClick={handleUnsetColor}
					>
						Remove color
					</button>
				</div>
			)}
		</div>
	);
}

export default TextColorPicker;
