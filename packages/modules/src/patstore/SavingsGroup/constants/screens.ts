export type SavingsGroupScreen =
	| "pinnwand"
	| "verein"
	| "sparregeln"
	| "sparfachbelegung"
	| "leerungen"
	| "lotto"
	| "sonderbuchungen"
	| "auszahlungen"
	| "gemeinschaftskasse"
	| "konto"
	| "kassenbericht"
	| "sparkoenig-auszahlung"
	| "sparkoenig-einwurf"
	| "sparkoenig-lottogewinn"
	| "sparkoenig-strafgeld";

export const SCREEN_TITLES: Record<SavingsGroupScreen, string> = {
	pinnwand: "Pinnwand",
	verein: "Verein",
	sparregeln: "Sparregeln",
	sparfachbelegung: "Sparfachbelegung",
	leerungen: "Sparkastenleerungen",
	lotto: "Lottogewinne",
	sonderbuchungen: "Sonderbuchungen",
	auszahlungen: "Auszahlungen",
	gemeinschaftskasse: "Gemeinschaftskasse",
	konto: "Sparer-Kontoauszüge",
	kassenbericht: "Kassenbericht",
	"sparkoenig-auszahlung": "Sparkönig – Auszahlung",
	"sparkoenig-einwurf": "Sparkönig – Einwurf",
	"sparkoenig-lottogewinn": "Sparkönig – Lottogewinn",
	"sparkoenig-strafgeld": "Sparkönig – Strafgeld"
};

export const parseScreen = (slug?: string): SavingsGroupScreen => {
	switch (slug) {
		case "verein":
		case "sparregeln":
		case "sparfachbelegung":
		case "leerungen":
		case "lotto":
		case "sonderbuchungen":
		case "auszahlungen":
		case "gemeinschaftskasse":
		case "konto":
		case "kassenbericht":
		case "sparkoenig-auszahlung":
		case "sparkoenig-einwurf":
		case "sparkoenig-lottogewinn":
		case "sparkoenig-strafgeld":
			return slug;
		default:
			return "pinnwand";
	}
};
