"use client";

import {
	Button,
	ColorSwatch,
	IconButton,
	Input,
	Popover,
	Portal,
	Select,
	VStack,
	createListCollection,
	type IconButtonProps
} from "@chakra-ui/react";
import type { Editor } from "@tiptap/react";
import {
	forwardRef,
	useId,
	useState,
	type ComponentType,
	type ReactNode
} from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import {
	LuAlignCenter,
	LuAlignJustify,
	LuAlignLeft,
	LuAlignRight,
	LuBaseline,
	LuBold,
	LuCode,
	LuHeading1,
	LuHeading2,
	LuHeading3,
	LuHeading4,
	LuHeading5,
	LuHeading6,
	LuItalic,
	LuLink,
	LuList,
	LuListOrdered,
	LuMinus,
	LuPilcrow,
	LuQuote,
	LuRemoveFormatting,
	LuRotateCcw,
	LuRotateCw,
	LuSquareCode,
	LuStrikethrough,
	LuUnlink,
	LuWrapText
} from "react-icons/lu";

import { Tooltip } from "../../../../Displays/Tooltip";
import setLink from "../../functions/setLink";
import { useRichTextEditorContext } from "./RichTextEditorContext";

type ButtonControlProps = IconButtonProps & {
	label: string;
	icon: ReactNode;
};

export const ButtonControl = forwardRef<HTMLButtonElement, ButtonControlProps>(
	function ButtonControl(props, ref) {
		const { icon, label, ...rest } = props;

		return (
			<Tooltip content={label}>
				<IconButton ref={ref} size="2xs" aria-label={label} {...rest}>
					{icon}
				</IconButton>
			</Tooltip>
		);
	}
);

///////////////////// Boolean Control /////////////////////

type ControlProps = Omit<ButtonControlProps, "label" | "icon">;

type BooleanControlConfig = {
	label: string;
	icon: ComponentType;
	command: (editor: Editor) => void;
	getVariant?: (editor: Editor) => IconButtonProps["variant"];
	isDisabled?: (editor: Editor) => boolean;
};

export function createBooleanControl(config: BooleanControlConfig) {
	const { label, icon: Icon, command, getVariant, isDisabled } = config;

	const BooleanControl = forwardRef<HTMLButtonElement, ControlProps>(
		function BooleanControl(props, ref) {
			const { editor } = useRichTextEditorContext();

			if (!editor) {
				return null;
			}

			return (
				<ButtonControl
					ref={ref}
					label={label}
					icon={<Icon />}
					variant={getVariant ? getVariant(editor) : "ghost"}
					disabled={isDisabled ? isDisabled(editor) : false}
					onClick={() => command(editor)}
					{...props}
				/>
			);
		}
	);

	BooleanControl.displayName = `BooleanControl(${label})`;

	return BooleanControl;
}

///////////////////// Select Control (with options) /////////////////////

type SelectControlOption = {
	value: string;
	label: string;
};

type SelectControlConfig = {
	label: string;
	options: SelectControlOption[];
	width?: string;
	placeholder?: string;
	getValue: (editor: Editor) => string;
	command: (editor: Editor, value: string) => void;
};

export function createSelectControl(config: SelectControlConfig) {
	const {
		label,
		options,
		width,
		placeholder = "Auswählen",
		getValue,
		command
	} = config;

	const collection = createListCollection({ items: options });

	const SelectControl = forwardRef<HTMLButtonElement>(
		function SelectControl(props, ref) {
			const { editor } = useRichTextEditorContext();
			const controlId = useId();

			if (!editor) {
				return null;
			}

			const currentValue = getValue(editor);
			const currentOption = options.find(
				(option) => option.value === currentValue
			);

			return (
				<Select.Root
					width={width}
					{...props}
					size="xs"
					variant="ghost"
					collection={collection}
					value={[currentValue]}
					onValueChange={(details) =>
						command(editor, details.value[0])
					}
					ids={{ trigger: controlId }}
					positioning={{ sameWidth: false }}
					css={{
						"--select-trigger-height": "sizes.6",
						"--select-trigger-padding-x": "spacing.2"
					}}
				>
					<Tooltip content={label} ids={{ trigger: controlId }}>
						<Select.Trigger ref={ref}>
							<Select.ValueText>
								{currentOption?.label || placeholder}
							</Select.ValueText>
							<Select.Indicator />
						</Select.Trigger>
					</Tooltip>
					<Portal>
						<Select.Positioner>
							<Select.Content minW="20">
								{options.map((option) => (
									<Select.Item
										key={option.value}
										item={option}
									>
										<Select.ItemText>
											{option.label}
										</Select.ItemText>
									</Select.Item>
								))}
							</Select.Content>
						</Select.Positioner>
					</Portal>
				</Select.Root>
			);
		}
	);

	SelectControl.displayName = `SelectControl(${label})`;

	return SelectControl;
}

///////////////////// Text Color Control /////////////////////

const DEFAULT_TEXT_COLOR = "#000000";

export function TextColor() {
	const { editor } = useRichTextEditorContext();
	const [open, setOpen] = useState(false);
	const triggerId = useId();

	if (!editor) {
		return null;
	}

	const activeColor = editor.getAttributes("textStyle").color as
		| string
		| undefined;

	return (
		<Popover.Root
			open={open}
			onOpenChange={(details) => setOpen(details.open)}
			ids={{ trigger: triggerId }}
			size="xs"
		>
			<Tooltip content="Textfarbe" ids={{ trigger: triggerId }}>
				<Popover.Trigger asChild>
					<IconButton
						size="2xs"
						aria-label="Textfarbe"
						variant={activeColor ? "subtle" : "ghost"}
					>
						<VStack gap="1px">
							<LuBaseline />
							<ColorSwatch
								value={activeColor || DEFAULT_TEXT_COLOR}
								h="4px"
								w="100%"
							/>
						</VStack>
					</IconButton>
				</Popover.Trigger>
			</Tooltip>
			<Portal>
				<Popover.Positioner>
					<Popover.Content width="fit-content">
						<Popover.Body
							display="flex"
							flexDirection="column"
							gap="2"
							padding="3"
						>
							<HexColorPicker
								color={activeColor || DEFAULT_TEXT_COLOR}
								style={{ width: "100%", height: "120px" }}
								onChange={(color) =>
									editor.chain().focus().setColor(color).run()
								}
							/>
							<Input asChild size="xs">
								{/* Applying the color without focusing the editor keeps the caret in this input while typing. */}
								<HexColorInput
									color={activeColor || DEFAULT_TEXT_COLOR}
									onChange={(color) =>
										editor.chain().setColor(color).run()
									}
									prefixed
								/>
							</Input>
							<Button
								size="xs"
								variant="outline"
								onClick={() => {
									editor.chain().focus().unsetColor().run();
									setOpen(false);
								}}
							>
								Farbe entfernen
							</Button>
						</Popover.Body>
					</Popover.Content>
				</Popover.Positioner>
			</Portal>
		</Popover.Root>
	);
}

///////////////////// Controls /////////////////////

export const FontSize = createSelectControl({
	label: "Schriftgröße",
	width: "96px",
	placeholder: "Standard",
	options: [
		{ value: "default", label: "Standard" },
		{ value: "10px", label: "10px" },
		{ value: "12px", label: "12px" },
		{ value: "14px", label: "14px" },
		{ value: "16px", label: "16px" },
		{ value: "18px", label: "18px" },
		{ value: "20px", label: "20px" },
		{ value: "24px", label: "24px" },
		{ value: "32px", label: "32px" }
	],
	getValue: (editor) =>
		editor.getAttributes("textStyle").fontSize || "default",
	command: (editor, value) =>
		value === "default"
			? editor.chain().focus().unsetFontSize().run()
			: editor.chain().focus().setFontSize(value).run()
});

export const Bold = createBooleanControl({
	label: "Fett",
	icon: LuBold,
	command: (editor) => editor.chain().focus().toggleBold().run(),
	getVariant: (editor) => (editor.isActive("bold") ? "subtle" : "ghost")
});

export const Italic = createBooleanControl({
	label: "Kursiv",
	icon: LuItalic,
	command: (editor) => editor.chain().focus().toggleItalic().run(),
	getVariant: (editor) => (editor.isActive("italic") ? "subtle" : "ghost")
});

export const Strikethrough = createBooleanControl({
	label: "Durchgestrichen",
	icon: LuStrikethrough,
	command: (editor) => editor.chain().focus().toggleStrike().run(),
	getVariant: (editor) => (editor.isActive("strike") ? "subtle" : "ghost")
});

export const Code = createBooleanControl({
	label: "Code",
	icon: LuCode,
	command: (editor) => editor.chain().focus().toggleCode().run(),
	getVariant: (editor) => (editor.isActive("code") ? "subtle" : "ghost")
});

export const CodeBlock = createBooleanControl({
	label: "Codeblock",
	icon: LuSquareCode,
	command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
	getVariant: (editor) => (editor.isActive("codeBlock") ? "subtle" : "ghost")
});

export const H1 = createBooleanControl({
	label: "Überschrift 1",
	icon: LuHeading1,
	command: (editor) =>
		editor.chain().focus().toggleHeading({ level: 1 }).run(),
	getVariant: (editor) =>
		editor.isActive("heading", { level: 1 }) ? "subtle" : "ghost"
});

export const H2 = createBooleanControl({
	label: "Überschrift 2",
	icon: LuHeading2,
	command: (editor) =>
		editor.chain().focus().toggleHeading({ level: 2 }).run(),
	getVariant: (editor) =>
		editor.isActive("heading", { level: 2 }) ? "subtle" : "ghost"
});

export const H3 = createBooleanControl({
	label: "Überschrift 3",
	icon: LuHeading3,
	command: (editor) =>
		editor.chain().focus().toggleHeading({ level: 3 }).run(),
	getVariant: (editor) =>
		editor.isActive("heading", { level: 3 }) ? "subtle" : "ghost"
});

export const H4 = createBooleanControl({
	label: "Überschrift 4",
	icon: LuHeading4,
	command: (editor) =>
		editor.chain().focus().toggleHeading({ level: 4 }).run(),
	getVariant: (editor) =>
		editor.isActive("heading", { level: 4 }) ? "subtle" : "ghost"
});

export const H5 = createBooleanControl({
	label: "Überschrift 5",
	icon: LuHeading5,
	command: (editor) =>
		editor.chain().focus().toggleHeading({ level: 5 }).run(),
	getVariant: (editor) =>
		editor.isActive("heading", { level: 5 }) ? "subtle" : "ghost"
});

export const H6 = createBooleanControl({
	label: "Überschrift 6",
	icon: LuHeading6,
	command: (editor) =>
		editor.chain().focus().toggleHeading({ level: 6 }).run(),
	getVariant: (editor) =>
		editor.isActive("heading", { level: 6 }) ? "subtle" : "ghost"
});

export const Paragraph = createBooleanControl({
	label: "Absatz",
	icon: LuPilcrow,
	command: (editor) => editor.chain().focus().setParagraph().run(),
	getVariant: (editor) => (editor.isActive("paragraph") ? "subtle" : "ghost")
});

export const BulletList = createBooleanControl({
	label: "Aufzählung",
	icon: LuList,
	command: (editor) => editor.chain().focus().toggleBulletList().run(),
	getVariant: (editor) => (editor.isActive("bulletList") ? "subtle" : "ghost")
});

export const OrderedList = createBooleanControl({
	label: "Nummerierte Liste",
	icon: LuListOrdered,
	command: (editor) => editor.chain().focus().toggleOrderedList().run(),
	getVariant: (editor) =>
		editor.isActive("orderedList") ? "subtle" : "ghost"
});

export const Blockquote = createBooleanControl({
	label: "Zitat",
	icon: LuQuote,
	command: (editor) => editor.chain().focus().toggleBlockquote().run(),
	getVariant: (editor) => (editor.isActive("blockquote") ? "subtle" : "ghost")
});

export const Hr = createBooleanControl({
	label: "Trennlinie",
	icon: LuMinus,
	command: (editor) => editor.chain().focus().setHorizontalRule().run()
});

export const HardBreak = createBooleanControl({
	label: "Zeilenumbruch",
	icon: LuWrapText,
	command: (editor) => editor.chain().focus().setHardBreak().run()
});

export const ClearFormatting = createBooleanControl({
	label: "Formatierung entfernen",
	icon: LuRemoveFormatting,
	command: (editor) =>
		editor.chain().focus().unsetAllMarks().clearNodes().run()
});

export const Link = createBooleanControl({
	label: "Link",
	icon: LuLink,
	command: (editor) => setLink(editor),
	getVariant: (editor) => (editor.isActive("link") ? "subtle" : "ghost")
});

export const Unlink = createBooleanControl({
	label: "Link entfernen",
	icon: LuUnlink,
	command: (editor) =>
		editor.chain().focus().extendMarkRange("link").unsetLink().run(),
	isDisabled: (editor) => !editor.isActive("link")
});

export const AlignLeft = createBooleanControl({
	label: "Linksbündig",
	icon: LuAlignLeft,
	command: (editor) => editor.chain().focus().setTextAlign("left").run(),
	getVariant: (editor) =>
		editor.isActive({ textAlign: "left" }) ? "subtle" : "ghost"
});

export const AlignCenter = createBooleanControl({
	label: "Zentriert",
	icon: LuAlignCenter,
	command: (editor) => editor.chain().focus().setTextAlign("center").run(),
	getVariant: (editor) =>
		editor.isActive({ textAlign: "center" }) ? "subtle" : "ghost"
});

export const AlignRight = createBooleanControl({
	label: "Rechtsbündig",
	icon: LuAlignRight,
	command: (editor) => editor.chain().focus().setTextAlign("right").run(),
	getVariant: (editor) =>
		editor.isActive({ textAlign: "right" }) ? "subtle" : "ghost"
});

export const AlignJustify = createBooleanControl({
	label: "Blocksatz",
	icon: LuAlignJustify,
	command: (editor) => editor.chain().focus().setTextAlign("justify").run(),
	getVariant: (editor) =>
		editor.isActive({ textAlign: "justify" }) ? "subtle" : "ghost"
});

export const Undo = createBooleanControl({
	label: "Rückgängig",
	icon: LuRotateCcw,
	command: (editor) => editor.chain().focus().undo().run(),
	isDisabled: (editor) => !editor.can().undo()
});

export const Redo = createBooleanControl({
	label: "Wiederherstellen",
	icon: LuRotateCw,
	command: (editor) => editor.chain().focus().redo().run(),
	isDisabled: (editor) => !editor.can().redo()
});
