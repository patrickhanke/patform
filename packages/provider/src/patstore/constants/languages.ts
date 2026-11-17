import { Language, LanguageValue } from "@repo/types";

export const toLocaleKey = (lang: string): LanguageValue => {
	if (lang === "de" || lang === "de-DE") return "de-DE";
	if (lang === "en" || lang === "en-EN" || lang === "en-GB") return "en-GB";
	return lang as LanguageValue;
};

export const languages: Language[] = [
	{
		label: "Deutsch",
		value: "de-DE"
	},
	{
		label: "Englisch",
		value: "en-GB"
	}
] as const;

export const languages_short: Language[] = [
	{
		label: "DE",
		value: "de-DE"
	},
	{
		label: "EN",
		value: "en-GB"
	}
] as const;
