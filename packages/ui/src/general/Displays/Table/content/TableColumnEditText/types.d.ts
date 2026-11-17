import { ClassTranslation, LanguageValue } from "@repo/types";

export type TableColumnEditTextType =
	"string" | "edit_string" | "textfield" | "edit_textfield" | "texteditor";

export type TableColumnEditTextProps = {
	type: TableColumnEditTextType;
	columnKey: string;
	value: string;
	translation?: ClassTranslation;
	isEditable?: boolean;
	isLink?: boolean;
	onChange: (key: string, value: string | ClassTranslation) => void;
	languages?: LanguageValue[];
	language?: LanguageValue;
	info?: string;
};

export type TableColumnStringProps = {
	value: string;
	columnKey: string;
	isEditable?: boolean;
	isLink?: boolean;
	onChange: (key: string, value: string | ClassTranslation) => void;
	info?: string;
};

export type TableColumnEditTextfieldProps = {
	value: string;
	isEditable?: boolean;
	onChange: (value: string) => void;
	info?: string;
};

export type TableColumnEditTexteditorProps = {
	value: string;
	onChange: (value: string) => void;
};

export type EditTranslationFieldProps = {
	value: ClassTranslation;
	columnKey: string;
	isEditable?: boolean;
	isLink?: boolean;
	onChange: (key: "translations", value: ClassTranslation) => void;
	languages?: LanguageValue[];
	language?: LanguageValue;
};

export type EditStringTranslationProps = EditTranslationFieldProps;
