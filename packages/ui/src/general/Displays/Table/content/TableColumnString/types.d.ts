export type TableColumnStringProps = {
	value: string;
	isEditable?: boolean;
	isLink?: boolean;
	onChange: (image: string, key?: string) => void;
	languages?: LanguageValue[];
	defaultLanguage?: LanguageValue;
};

export type EditStringProps = {
	value: string;
	isEditable?: boolean;
	isLink?: boolean;
	onChange: (image: string) => void;
	languages?: LanguageValue[];
	defaultLanguage?: LanguageValue;
};
