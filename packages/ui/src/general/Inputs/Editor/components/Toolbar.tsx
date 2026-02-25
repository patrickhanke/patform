import classNames from "classnames";
import { useEffect, useState } from "react";
import { Editor } from "@tiptap/react";
import {
	RiBold,
	RiItalic,
	RiStrikethrough,
	RiCodeSSlashLine,
	RiEmotionLine,
	RiH1,
	RiH2,
	RiH3,
	RiH4,
	RiH5,
	RiH6,
	RiParagraph,
	RiListOrdered,
	RiListUnordered,
	RiCodeBoxLine,
	RiLink,
	RiLinkUnlink,
	RiDoubleQuotesL,
	RiSeparator,
	RiTextWrap,
	RiFormatClear,
	RiArrowGoBackLine,
	RiArrowGoForwardLine,
	RiAlignLeft,
	RiAlignCenter,
	RiAlignRight,
	RiAlignJustify
} from "react-icons/ri";
// import sample from 'lodash-es/sample.js';
import { useInView } from "react-cool-inview";

import setLink from "../functions/setLink";

// sample(['teste']);

type ToolbarProps = {
	editor: Editor;
};

function Toolbar({ editor }: ToolbarProps) {
	const [, setSelectionUpdate] = useState(0);
	const isCursorOverLink = editor.getAttributes("link").href;

	useEffect(() => {
		const handler = () => setSelectionUpdate((n) => n + 1);
		editor.on("selectionUpdate", handler);
		editor.on("transaction", handler);
		return () => {
			editor.off("selectionUpdate", handler);
			editor.off("transaction", handler);
		};
	}, [editor]);

	const { observe, inView } = useInView({
		rootMargin: "-1px 0px 0px 0px",
		threshold: [1]
	});

	return (
		<div
			className={classNames("ToolbarContainer", { sticky: !inView })}
			ref={observe}
		>
			<div className="Toolbar">
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
				<div
					className={classNames("icon", {
						active: editor.isActive("code")
					})}
					onClick={() => editor.chain().focus().toggleCode().run()}
				>
					<RiCodeSSlashLine />
				</div>
				<div className="divider"></div>
				<div
					className="icon"
					onClick={() =>
						editor
							.chain()
							.focus()
							// .insertEmoji(sample(['😀', '😁', '😂', '😎', '😍', '😱']) as string)
							.run()
					}
				>
					<RiEmotionLine />
				</div>
				<div className="divider"></div>
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
					className={classNames("icon", {
						active: editor.isActive("heading", { level: 3 })
					})}
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 3 }).run()
					}
				>
					<RiH3 />
				</div>
				<div
					className={classNames("icon", {
						active: editor.isActive("heading", { level: 4 })
					})}
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 4 }).run()
					}
				>
					<RiH4 />
				</div>
				<div
					className={classNames("icon", {
						active: editor.isActive("heading", { level: 5 })
					})}
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 5 }).run()
					}
				>
					<RiH5 />
				</div>
				<div
					className={classNames("icon", {
						active: editor.isActive("heading", { level: 6 })
					})}
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 6 }).run()
					}
				>
					<RiH6 />
				</div>
				<div
					className={classNames("icon", {
						active: editor.isActive("paragraph")
					})}
					onClick={() => editor.chain().focus().setParagraph().run()}
				>
					<RiParagraph />
				</div>
				<div
					className={classNames("icon", {
						active: editor.isActive("bulletList")
					})}
					onClick={() =>
						editor.chain().focus().toggleBulletList().run()
					}
				>
					<RiListOrdered />
				</div>
				<div
					className={classNames("icon", {
						active: editor.isActive("orderedList")
					})}
					onClick={() =>
						editor.chain().focus().toggleOrderedList().run()
					}
				>
					<RiListUnordered />
				</div>
				<div
					className={classNames("icon", {
						active: editor.isActive("codeBlock")
					})}
					onClick={() =>
						editor.chain().focus().toggleCodeBlock().run()
					}
				>
					<RiCodeBoxLine />
				</div>
				<div className="divider"></div>
				<div className="icon" onClick={() => setLink(editor)}>
					<RiLink />
				</div>
				<div
					className={classNames("icon", {
						disabled: !isCursorOverLink
					})}
					onClick={() => setLink(editor)}
				>
					<RiLinkUnlink />
				</div>
				<div className="divider"></div>
				<div
					className={classNames("icon", {
						active: editor.isActive("blockquote")
					})}
					onClick={() =>
						editor.chain().focus().toggleBlockquote().run()
					}
				>
					<RiDoubleQuotesL />
				</div>
				<div
					className="icon"
					onClick={() =>
						editor.chain().focus().setHorizontalRule().run()
					}
				>
					<RiSeparator />
				</div>
				<div className="divider"></div>
				<div
					className="icon"
					onClick={() => editor.chain().focus().setHardBreak().run()}
				>
					<RiTextWrap />
				</div>
				<div
					className="icon"
					onClick={() =>
						editor
							.chain()
							.focus()
							.unsetAllMarks()
							.clearNodes()
							.run()
					}
				>
					<RiFormatClear />
				</div>
				<div className="divider"></div>
				<div
					className={classNames("icon", {
						active: editor.isActive({ textAlign: "left" })
					})}
					onClick={() =>
						editor.chain().focus().setTextAlign("left").run()
					}
				>
					<RiAlignLeft />
				</div>
				<div
					className={classNames("icon", {
						active: editor.isActive({ textAlign: "center" })
					})}
					onClick={() =>
						editor.chain().focus().setTextAlign("center").run()
					}
				>
					<RiAlignCenter />
				</div>
				<div
					className={classNames("icon", {
						active: editor.isActive({ textAlign: "right" })
					})}
					onClick={() =>
						editor.chain().focus().setTextAlign("right").run()
					}
				>
					<RiAlignRight />
				</div>
				<div
					className={classNames("icon", {
						active: editor.isActive({ textAlign: "justify" })
					})}
					onClick={() =>
						editor.chain().focus().setTextAlign("justify").run()
					}
				>
					<RiAlignJustify />
				</div>
				<div className="divider"></div>
				<div
					className="icon"
					onClick={() => editor.chain().focus().undo().run()}
				>
					<RiArrowGoBackLine />
				</div>
				<div
					className="icon"
					onClick={() => editor.chain().focus().redo().run()}
				>
					<RiArrowGoForwardLine />
				</div>
			</div>
		</div>
	);
}

export default Toolbar;
