import { Language } from "@repo/types";

export const languages: Language[] = [
	{
		label: "Deutsch",
		value: "de-DE"
	},
	{
		label: "Englisch",
		value: "en-EN"
	}
] as const;

export const languages_short: Language[] = [
	{
		label: "DE",
		value: "de-DE"
	},
	{
		label: "EN",
		value: "en-EN"
	}
] as const;
