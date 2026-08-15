import { Language } from "@repo/types";

export const languages: Language[] = [
	{
		label: "Deutsch",
		value: "de"
	},
	{
		label: "Englisch",
		value: "en"
	}
] as const;

export const languages_short: Language[] = [
	{
		label: "DE",
		value: "de"
	},
	{
		label: "EN",
		value: "en"
	}
] as const;
