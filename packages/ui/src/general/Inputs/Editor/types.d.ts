export type EditorComponent = {
	content?: string;
	editable?: boolean;
	placeholder?: string;
	disabled?: boolean;
	withToolbar?: boolean;
	withPopover?: boolean;
	withTypographyExtension?: boolean;
	withLinkExtension?: boolean;
	withCodeBlockLowlightExtension?: boolean;
	withTaskListExtension?: boolean;
	withPlaceholderExtension?: boolean;
	withMentionSuggestion?: boolean;
	withEmojiSuggestion?: boolean;
	withEmojisReplacer?: boolean;
	onChange: (value: string) => void;
	onClickOutside?: (value: string) => void;
	withHexColorsDecorator?: boolean;
	id?: string;
	label?: string;
};

// export type EditorComponent = {
//     onChange: ({text, content}: {text: string, content: string}) => void,
//     text: string
// }
