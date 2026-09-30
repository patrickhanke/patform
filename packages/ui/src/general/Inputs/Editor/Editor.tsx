"use client";

import { useEffect, useRef } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";

import type { Extensions } from "@tiptap/react";

// Load all highlight.js supported languages
import { createLowlight, common } from "lowlight";
const lowlight = createLowlight(common);

import { MentionSuggestion, HexColorDecorator, FontSize } from "./extensions";

import { RichTextEditor } from "./components/RichTextEditor";
import Toolbar from "./components/Toolbar";
import Popover from "./components/Popover";

import "./styles.scss";
import { useDebounceValue, useOnClickOutside } from "usehooks-ts";
import { EditorComponent } from "./types";

function Editor({
	content = "",
	label = "",
	id = "",
	placeholder = "Type '/' for actions…",
	disabled = false,
	withToolbar = true,
	withPopover = false,
	withTypographyExtension = false,
	withCodeBlockLowlightExtension = false,
	withTaskListExtension = false,
	withPlaceholderExtension = false,
	withMentionSuggestion = false,
	onChange,
	onClickOutside = () => null,
	withHexColorsDecorator = false,
	withTextAlign = true,
	withImages = false
}: EditorComponent) {
	const [debouncedValue, setEditorHtmlContent] = useDebounceValue(
		content,
		1000
	);
	const editorRef = useRef(null);

	useOnClickOutside(editorRef, onClickOutside);

	const extensions: Extensions = [
		StarterKit.configure({
			...(withCodeBlockLowlightExtension && { codeBlock: false })
		})
	];

	// Always add Link extension
	extensions.push(
		Link.configure({
			linkOnPaste: false,
			openOnClick: false
		})
	);

	// TextStyle + Color + FontSize (inline marks on textStyle)
	extensions.push(TextStyle, Color, FontSize);

	if (withTypographyExtension) {
		extensions.push(Typography);
	}

	if (withCodeBlockLowlightExtension) {
		extensions.push(
			CodeBlockLowlight.configure({
				lowlight
			})
		);
	}

	if (withTaskListExtension) {
		extensions.push(TaskList, TaskItem);
	}

	if (withPlaceholderExtension) {
		extensions.push(
			Placeholder.configure({
				placeholder
			})
		);
	}

	if (withMentionSuggestion) {
		extensions.push(MentionSuggestion);
	}

	if (withHexColorsDecorator) {
		extensions.push(HexColorDecorator);
	}

	if (withTextAlign) {
		extensions.push(
			TextAlign.configure({
				types: ["heading", "paragraph"]
			})
		);
	}

	if (withImages) {
		extensions.push(Image);
	}

	const editor = useEditor(
		{
			content,
			extensions,
			editable: !disabled,
			onUpdate: ({ editor }) => {
				setEditorHtmlContent(editor.getHTML());
			}
		},
		[disabled]
	);

	useEffect(() => {
		if (content !== debouncedValue) {
			onChange(debouncedValue);
		}
	}, [debouncedValue]);

	if (!editor) {
		return null;
	}

	return (
		<div ref={editorRef} style={{ width: "100%" }}>
			{label && <label htmlFor={id}>{label}</label>}
			<RichTextEditor.Root editor={editor} disabled={disabled}>
				{withToolbar ? (
					<Toolbar
						withTextAlign={withTextAlign}
						withImages={withImages}
					/>
				) : null}
				{withPopover ? <Popover /> : null}
				<RichTextEditor.Content id={id || undefined} />
			</RichTextEditor.Root>
		</div>
	);
}

export default Editor;
