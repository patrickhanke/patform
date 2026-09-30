import { FC, useCallback } from "react";
import {
	TableColumnEditString,
	TableColumnEditStringTranslation,
	TableColumnEditTextfield,
	TableColumnEditTextfieldTranslation,
	TableColumnEditTexteditor,
	TableColumnEditTexteditorTranslation
} from "./components";
import { TableColumnEditTextProps } from "./types";
import { get, set } from "lodash";
import { ClassTranslation } from "@repo/types";

export const TableColumnEditText: FC<TableColumnEditTextProps> = ({
	type,
	columnKey,
	value,
	translation,
	isEditable,
	isLink,
	onChange,
	languages = [],
	language
}) => {
	const getTranslation = useCallback((): ClassTranslation => {
		if (!translation) {
			const defaultTranslation: ClassTranslation = {};
			languages.forEach((lang) => {
				set(defaultTranslation, `${lang}.${columnKey}`, value);
			});
			return defaultTranslation;
		}
		return translation;
	}, [translation, languages, columnKey, value]);

	const handleChange = useCallback(
		(key: string, nextValue: string | ClassTranslation) => {
			if (key === "translations") {
				onChange("translations", nextValue as ClassTranslation);
				const columnValue =
					get(nextValue, `${language}.${columnKey}`) || "";
				onChange(columnKey, columnValue);
			} else {
				onChange(columnKey, nextValue);
			}
		},
		[onChange, language, columnKey]
	);

	const handleFieldChange = useCallback(
		(nextValue: string) => {
			onChange(columnKey, nextValue);
		},
		[onChange, columnKey]
	);

	if (!isLink && languages.length > 1 && language) {
		switch (type) {
			case "edit_string":
				return (
					<TableColumnEditStringTranslation
						value={getTranslation()}
						columnKey={columnKey}
						isEditable={isEditable}
						isLink={isLink}
						onChange={handleChange}
						languages={languages}
						language={language}
					/>
				);
			case "edit_textfield":
				return (
					<TableColumnEditTextfieldTranslation
						value={getTranslation()}
						columnKey={columnKey}
						isEditable={isEditable}
						onChange={handleChange}
						languages={languages}
						language={language}
					/>
				);
			case "texteditor":
				return (
					<TableColumnEditTexteditorTranslation
						value={getTranslation()}
						columnKey={columnKey}
						onChange={handleChange}
						languages={languages}
						language={language}
					/>
				);
			default:
				return null;
		}
	}

	switch (type) {
		case "string":
		case "edit_string":
			return (
				<TableColumnEditString
					value={value}
					columnKey={columnKey}
					isEditable={isEditable}
					isLink={isLink}
					onChange={onChange}
				/>
			);
		case "textfield":
		case "edit_textfield":
			return (
				<TableColumnEditTextfield
					value={value}
					isEditable={isEditable}
					onChange={handleFieldChange}
				/>
			);
		case "texteditor":
			return (
				<TableColumnEditTexteditor
					value={value}
					onChange={handleFieldChange}
				/>
			);
		default:
			return null;
	}
};
