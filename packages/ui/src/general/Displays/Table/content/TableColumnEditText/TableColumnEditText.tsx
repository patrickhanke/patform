import { FC, useCallback, useMemo } from "react";
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
import { toLocaleKey } from "@repo/provider";

export const TableColumnEditText: FC<TableColumnEditTextProps> = ({
	type,
	columnKey,
	value,
	translation,
	isEditable,
	isLink,
	onChange,
	languages = [],
	language,
	info
}) => {
	const locales = useMemo(
		() => [...new Set(languages.map((lang) => toLocaleKey(lang)))],
		[languages]
	);
	const locale = language ? toLocaleKey(language) : undefined;

	const normalizeTranslations = useCallback(
		(source: ClassTranslation): ClassTranslation => {
			const next = {} as ClassTranslation;
			Object.entries(source || {}).forEach(([key, fields]) => {
				const localeKey = toLocaleKey(key);
				if (key === localeKey || !next[localeKey]) {
					next[localeKey] = {
						...(next[localeKey] || {}),
						...(fields || {})
					};
				}
			});
			return next;
		},
		[]
	);

	const getTranslation = useCallback((): ClassTranslation => {
		if (!translation) {
			const defaultTranslation: ClassTranslation = {};
			locales.forEach((lang) => {
				set(defaultTranslation, `${lang}.${columnKey}`, value);
			});
			return defaultTranslation;
		}
		return normalizeTranslations(translation);
	}, [translation, locales, columnKey, value, normalizeTranslations]);

	const handleChange = useCallback(
		(key: string, nextValue: string | ClassTranslation) => {
			if (key === "translations") {
				const normalized = normalizeTranslations(
					nextValue as ClassTranslation
				);
				onChange("translations", normalized);
				const columnValue =
					(locale && get(normalized, `${locale}.${columnKey}`)) || "";
				onChange(columnKey, columnValue);
			} else {
				onChange(columnKey, nextValue);
			}
		},
		[onChange, locale, columnKey, normalizeTranslations]
	);

	const handleFieldChange = useCallback(
		(nextValue: string) => {
			onChange(columnKey, nextValue);
		},
		[onChange, columnKey]
	);

	if (!isLink && locales.length > 1 && locale) {
		switch (type) {
			case "edit_string":
				return (
					<TableColumnEditStringTranslation
						value={getTranslation()}
						columnKey={columnKey}
						isEditable={isEditable}
						isLink={isLink}
						onChange={handleChange}
						languages={locales}
						language={locale}
					/>
				);
			case "edit_textfield":
				return (
					<TableColumnEditTextfieldTranslation
						value={getTranslation()}
						columnKey={columnKey}
						isEditable={isEditable}
						onChange={handleChange}
						languages={locales}
						language={locale}
					/>
				);
			case "texteditor":
				return (
					<TableColumnEditTexteditorTranslation
						value={getTranslation()}
						columnKey={columnKey}
						onChange={handleChange}
						languages={locales}
						language={locale}
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
					info={info}
				/>
			);
		case "textfield":
		case "edit_textfield":
			return (
				<TableColumnEditTextfield
					value={value}
					isEditable={isEditable}
					onChange={handleFieldChange}
					info={info}
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
