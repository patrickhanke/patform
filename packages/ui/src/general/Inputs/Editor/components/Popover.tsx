import React, { useEffect, useState } from "react";
import { BubbleMenu, Editor } from "@tiptap/react";
import classNames from "classnames";
import {
	RiBold,
	RiItalic,
	RiStrikethrough,
	RiH1,
	RiH2,
	RiCodeSSlashLine,
	RiLink,
	RiLinkUnlink
} from "react-icons/ri";

import setLink from "../functions/setLink";
import TextColorPicker from "./TextColorPicker";

type PopoverProps = {
	editor: Editor;
};

function Popover({ editor }: PopoverProps) {
	const [, setSelectionUpdate] = useState(0);
	const isSelectionOverLink = editor.getAttributes("link").href;

	useEffect(() => {
		const handler = () => setSelectionUpdate((n) => n + 1);
		editor.on("selectionUpdate", handler);
		editor.on("transaction", handler);
		return () => {
			editor.off("selectionUpdate", handler);
			editor.off("transaction", handler);
		};
	}, [editor]);

	return (
		<BubbleMenu className="Popover" editor={editor}>
			<div
				className={classNames("icon", {
					active: editor.isActive("bold")
				})}
				onClick={() => editor.chain().focus().toggleBold().run()}
			>
				<RiBold />
			</div>
			<div
				className={classNames("icon", {
					active: editor.isActive("italic")
				})}
				onClick={() => editor.chain().focus().toggleItalic().run()}
			>
				<RiItalic />
			</div>
			<div
				className={classNames("icon", {
					active: editor.isActive("strike")
				})}
				onClick={() => editor.chain().focus().toggleStrike().run()}
			>
				<RiStrikethrough />
			</div>
			<TextColorPicker editor={editor} />
			<div
				className={classNames("icon", {
					active: editor.isActive("heading", { level: 1 })
				})}
				onClick={() =>
					editor.chain().focus().toggleHeading({ level: 1 }).run()
				}
			>
				<RiH1 />
			</div>
			<div
				className={classNames("icon", {
					active: editor.isActive("heading", { level: 2 })
				})}
				onClick={() =>
					editor.chain().focus().toggleHeading({ level: 2 }).run()
				}
			>
				<RiH2 />
			</div>
			<div
				className="icon"
				onClick={() =>
					isSelectionOverLink
						? editor.chain().focus().unsetLink().run()
						: setLink(editor)
				}
			>
				{isSelectionOverLink ? <RiLinkUnlink /> : <RiLink />}
			</div>
			<div
				className={classNames("icon", {
					active: editor.isActive("code")
				})}
				onClick={() => editor.chain().focus().toggleCode().run()}
			>
				<RiCodeSSlashLine />
			</div>
		</BubbleMenu>
	);
}

export default Popover;
