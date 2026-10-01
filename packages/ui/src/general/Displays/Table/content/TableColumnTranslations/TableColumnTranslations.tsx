import React, { useCallback } from "react";
import { TableColumnTranslationTitleProps } from "./types";
import { EditTitleTranslation } from "./components";

const TableColumnTranslationTitle = ({
	value,
	isLink = false,
	onChange,
	languages = [],
	defaultLanguage
}: TableColumnTranslationTitleProps) => {
	if (languages.length === 0) {
		return null;
	}

	const changeTranslationValue = useCallback(
		(key: string, value: string) => {
			console.log(key, value);
		},
		[onChange]
	);
	return (
		<>
			<EditTitleTranslation
				value={value}
				isLink={isLink}
				onChange={changeTranslationValue}
				languages={languages}
				defaultLanguage={defaultLanguage}
			/>
		</>
	);
};

export const Translations = {
	Title: TableColumnTranslationTitle
};
