import { languages, languages_short, toLocaleKey } from "@repo/provider";
import { LanguageValue } from "@repo/types";
import { SwitchButton } from "../../../Buttons/SwitchButtons/types";

export const getLanguageLabel = (lang: LanguageValue): string => {
	const locale = toLocaleKey(lang);
	return (
		languages_short.find((l) => l.value === locale)?.label ||
		languages.find((l) => l.value === locale)?.label ||
		locale.slice(0, 2).toUpperCase()
	);
};

export const getLanguageSwitchStates = (
	languageValues: LanguageValue[]
): SwitchButton[] => {
	const locales = [...new Set(languageValues.map((lang) => toLocaleKey(lang)))];
	return locales.map((lang) => ({
		value: lang,
		label: getLanguageLabel(lang),
		disabled: false
	}));
};