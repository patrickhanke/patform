"use client";

import { BubbleMenu } from "@tiptap/react";

import {
	Control,
	RichTextEditor,
	useRichTextEditorContext
} from "./RichTextEditor";

function Popover() {
	const { editor } = useRichTextEditorContext();

	if (!editor) {
		return null;
	}

	return (
		<BubbleMenu
			editor={editor}
			// Controls render in portals, so the menu must survive the editor losing focus.
			shouldShow={({ state }) => !state.selection.empty}
		>
			<RichTextEditor.Toolbar variant="floating">
				<RichTextEditor.ControlGroup>
					<Control.Bold />
					<Control.Italic />
					<Control.Strikethrough />
					<Control.Code />
				</RichTextEditor.ControlGroup>
				<RichTextEditor.ControlGroup>
					<Control.TextColor />
					<Control.FontSize />
				</RichTextEditor.ControlGroup>
				<RichTextEditor.ControlGroup>
					<Control.H1 />
					<Control.H2 />
				</RichTextEditor.ControlGroup>
				<RichTextEditor.ControlGroup>
					<Control.Link />
					<Control.Unlink />
				</RichTextEditor.ControlGroup>
			</RichTextEditor.Toolbar>
		</BubbleMenu>
	);
}

export default Popover;
