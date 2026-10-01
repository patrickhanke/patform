"use client";

import { Control, RichTextEditor } from "./RichTextEditor";
import InsertImage from "./InsertImage";

type ToolbarProps = {
	withTextAlign?: boolean;
	withImages?: boolean;
};

function Toolbar({ withTextAlign = true, withImages = false }: ToolbarProps) {
	return (
		<RichTextEditor.Toolbar variant="fixed">
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
				<Control.H3 />
				<Control.H4 />
				<Control.H5 />
				<Control.H6 />
				<Control.Paragraph />
			</RichTextEditor.ControlGroup>
			<RichTextEditor.ControlGroup>
				<Control.BulletList />
				<Control.OrderedList />
				<Control.CodeBlock />
			</RichTextEditor.ControlGroup>
			<RichTextEditor.ControlGroup>
				<Control.Link />
				<Control.Unlink />
			</RichTextEditor.ControlGroup>
			<RichTextEditor.ControlGroup>
				<Control.Blockquote />
				<Control.Hr />
			</RichTextEditor.ControlGroup>
			<RichTextEditor.ControlGroup>
				<Control.HardBreak />
				<Control.ClearFormatting />
			</RichTextEditor.ControlGroup>
			{withTextAlign && (
				<RichTextEditor.ControlGroup>
					<Control.AlignLeft />
					<Control.AlignCenter />
					<Control.AlignRight />
					<Control.AlignJustify />
				</RichTextEditor.ControlGroup>
			)}
			<RichTextEditor.ControlGroup>
				<Control.Undo />
				<Control.Redo />
			</RichTextEditor.ControlGroup>
			{withImages && (
				<RichTextEditor.ControlGroup>
					<InsertImage />
				</RichTextEditor.ControlGroup>
			)}
		</RichTextEditor.Toolbar>
	);
}

export default Toolbar;
