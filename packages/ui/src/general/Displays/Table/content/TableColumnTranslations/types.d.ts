import { ClassTranslation } from "@repo/types";

export type TableColumnTranslationTitleProps = {
	value: string;
	isLink: boolean;
	onChange: (value: ClassTranslation) => void;
	languages: string[];
	defaultLanguage: string;
};

export type EditTitleTranslationProps = {
	value: string;
	isLink: boolean;
	onChange: (key: string, value: string) => void;
	languages: string[];
	defaultLanguage: string;
};
