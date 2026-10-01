"use client";

import {
	Box,
	HStack,
	StackSeparator,
	defineStyle,
	type BoxProps,
	type StackProps
} from "@chakra-ui/react";
import {
	EditorContent,
	type Editor,
	type EditorContentProps
} from "@tiptap/react";
import {
	forwardRef,
	useEffect,
	useMemo,
	useState,
	type CSSProperties
} from "react";

import {
	RichTextEditorContext,
	useRichTextEditorContext
} from "./RichTextEditorContext";

const proseMirrorBaseCss = defineStyle({
	display: "flex",
	flexDirection: "column",
	borderWidth: "1px",
	rounded: "l2",
	lineHeight: "1.5",
	bg: "bg",

	"--content-padding-x": "spacing.3",
	"--content-padding-y": "spacing.3",
	"--content-min-height": "120px",

	"& img.ProseMirror-selectednode": {
		outlineWidth: "2px",
		outlineStyle: "solid",
		outlineColor: "blue.focusRing"
	},

	"& .ProseMirror": {
		outline: "none",
		minHeight: "var(--content-min-height)",
		px: "var(--content-padding-x)",
		py: "var(--content-padding-y)",
		"& > * + *": { marginTop: "0.75em" },
		"& h1": {
			fontSize: "2.15em",
			letterSpacing: "-0.02em",
			lineHeight: "1.2em"
		},
		"& h2": {
			fontSize: "1.65em",
			letterSpacing: "-0.02em",
			lineHeight: "1.3em"
		},
		"& h3": {
			fontSize: "1.35em",
			letterSpacing: "-0.01em",
			lineHeight: "1.4em"
		},
		"& h4": {
			fontSize: "1.15em",
			letterSpacing: "-0.01em",
			lineHeight: "1.5em"
		},
		"& h5": {
			fontSize: "1em",
			letterSpacing: "-0.01em",
			lineHeight: "1.5em"
		},
		"& h6": {
			fontSize: "0.875em",
			letterSpacing: "-0.01em",
			lineHeight: "1.5em"
		},
		"& h1, h2, h3, h4, h5, h6": {
			color: "fg",
			fontWeight: "600"
		},
		"& code": {
			bg: "bg.muted",
			paddingInline: "0.25em",
			rounded: "sm",
			fontFamily: "mono",
			fontSize: "0.9em",
			borderWidth: "1px"
		},
		"& pre": {
			bg: "bg.muted",
			color: "fg",
			padding: "4",
			rounded: "lg",
			overflowX: "auto",
			fontSize: "sm",
			lineHeight: "1.6",
			borderWidth: "1px"
		},
		"& pre code": {
			bg: "transparent",
			padding: "0",
			fontFamily: "mono",
			color: "inherit",
			borderWidth: "0"
		},
		"& blockquote": {
			borderStartWidth: "4px",
			borderStartColor: "border",
			paddingStart: "4"
		},
		"& ul:not([data-type='taskList'])": {
			paddingInlineStart: "1.25rem",
			listStyleType: "disc"
		},
		"& ol:not([data-type='taskList'])": {
			paddingInlineStart: "1.25rem",
			listStyleType: "decimal"
		},
		"& ul ul": {
			listStyleType: "circle"
		},
		"& ul ul ul": {
			listStyleType: "square"
		},
		"& ul[data-type='taskList'] li": {
			listStyle: "none",
			display: "flex",
			alignItems: "flex-start",
			gap: "2",
			"& input[type='checkbox']": {
				accentColor: "colorPalette.solid",
				marginTop: "1"
			}
		},
		"& img": { maxWidth: "100%", height: "auto", rounded: "l2" },
		"& hr": { my: "4" },
		"& a": { color: "blue.fg", textDecoration: "underline" },
		"& em": { fontStyle: "italic" },
		"& strong": { fontWeight: "bold" },
		"& p.is-editor-empty:first-of-type::before": {
			content: "attr(data-placeholder)",
			color: "fg.muted",
			pointerEvents: "none",
			float: "left",
			height: "0"
		}
	},

	"&[data-disabled]": {
		pointerEvents: "none",
		cursor: "not-allowed"
	},

	"&[data-disabled] .ProseMirror": {
		opacity: 0.5
	}
});

export type RichTextEditorRootProps = BoxProps & {
	editor: Editor | null;
	disabled?: boolean;
};

export const RichTextEditorRoot = forwardRef<
	HTMLDivElement,
	RichTextEditorRootProps
>(function RichTextEditorRoot(props, ref) {
	const { editor, children, css, disabled, ...rest } = props;
	const [version, setVersion] = useState(0);

	useEffect(() => {
		if (!editor) {
			return;
		}

		const handleTransaction = () => setVersion((current) => current + 1);

		editor.on("transaction", handleTransaction);

		return () => {
			editor.off("transaction", handleTransaction);
		};
	}, [editor]);

	const contextValue = useMemo(
		() => ({ editor, version }),
		[editor, version]
	);

	return (
		<RichTextEditorContext.Provider value={contextValue}>
			<Box
				ref={ref}
				data-disabled={disabled || undefined}
				css={[proseMirrorBaseCss, css]}
				{...rest}
			>
				{children}
			</Box>
		</RichTextEditorContext.Provider>
	);
});

const toolbarStylesMap = {
	sticky: {
		bg: "bg",
		position: "sticky",
		top: "var(--sticky-offset, 0px)",
		zIndex: "1",
		py: "1.5",
		px: "3"
	},
	fixed: {
		bg: "bg",
		roundedTop: "l2",
		borderBottomWidth: "1px",
		py: "1.5",
		px: "3"
	},
	floating: {
		shadow: "md",
		rounded: "l2",
		bg: "bg.panel",
		px: "1.5",
		py: "1.5"
	}
};

export type RichTextEditorToolbarProps = StackProps & {
	variant?: keyof typeof toolbarStylesMap;
	stickyOffset?: string;
};

export const RichTextEditorToolbar = forwardRef<
	HTMLDivElement,
	RichTextEditorToolbarProps
>(function RichTextEditorToolbar(props, ref) {
	const { variant = "fixed", stickyOffset = "0px", ...rest } = props;
	const variantStyles = toolbarStylesMap[variant];

	return (
		<HStack
			ref={ref}
			flexWrap="wrap"
			separator={<StackSeparator h="5" alignSelf="center" />}
			{...rest}
			style={
				{
					"--sticky-offset": stickyOffset,
					...rest.style
				} as CSSProperties
			}
			css={[variantStyles, rest.css]}
		/>
	);
});

export const RichTextEditorFooter = forwardRef<HTMLDivElement, StackProps>(
	function RichTextEditorFooter(props, ref) {
		return (
			<HStack ref={ref} gap="1" borderTopWidth="1px" p="3" {...props} />
		);
	}
);

export const RichTextEditorContent = forwardRef<
	HTMLDivElement,
	Omit<EditorContentProps, "editor" | "ref">
>(function RichTextEditorContent(props, ref) {
	const { editor } = useRichTextEditorContext();

	if (!editor) {
		return null;
	}

	return <EditorContent editor={editor} ref={ref} {...props} />;
});

export const RichTextEditorControlGroup = forwardRef<
	HTMLDivElement,
	StackProps
>(function RichTextEditorControlGroup(props, ref) {
	return <HStack ref={ref} gap="1" {...props} />;
});

export const RichTextEditor = {
	Root: RichTextEditorRoot,
	Toolbar: RichTextEditorToolbar,
	Content: RichTextEditorContent,
	ControlGroup: RichTextEditorControlGroup,
	Footer: RichTextEditorFooter
};

export * as Control from "./Controls";

export { createBooleanControl, createSelectControl } from "./Controls";

export { useRichTextEditorContext } from "./RichTextEditorContext";
