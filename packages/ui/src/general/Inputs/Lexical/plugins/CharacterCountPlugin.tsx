/**
 * Plugin to display character count
 */
import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import "./CharacterCountPlugin.scss";

export interface CharacterCountPluginProps {
	maxLength?: number;
}

export default function CharacterCountPlugin({ maxLength }: CharacterCountPluginProps) {
	const [editor] = useLexicalComposerContext();
	const [characterCount, setCharacterCount] = useState(0);

	useEffect(() => {
		return editor.registerUpdateListener(({ editorState }) => {
			editorState.read(() => {
				const root = $getRoot();
				const textContent = root.getTextContent();
				setCharacterCount(textContent.length);
			});
		});
	}, [editor]);

	const isOverLimit = maxLength && characterCount > maxLength;

	return (
		<div className={`character-count ${isOverLimit ? "over-limit" : ""}`}>
			{characterCount}
			{maxLength && ` / ${maxLength}`}
		</div>
	);
}
