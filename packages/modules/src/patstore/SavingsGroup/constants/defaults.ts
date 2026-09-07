import {
	SavingRule,
	SavingsGroupClubSettings,
	SavingsGroupModuleData
} from "@repo/types";

export const DEFAULT_CLUB_SETTINGS: SavingsGroupClubSettings = {
	name: "",
	street: "",
	houseNumber: "",
	zip: "",
	city: "",
	country: "DE",
	currency: "EUR",
	email: ""
};

export const DEFAULT_SAVING_RULE: SavingRule = {
	id: 1,
	name: "Sparregeln 1",
	einwurf_min: 0,
	strafgeld: 0,
	sparclub: 0,
	sparclub_min: 0,
	sparclub_vg: 0,
	lotto: 0,
	lotto_min: 0,
	lotto_vg: 0
};

export const DEFAULT_SAVINGS_GROUP_DATA: SavingsGroupModuleData = {
	settings: { ...DEFAULT_CLUB_SETTINGS },
	savingRules: [{ ...DEFAULT_SAVING_RULE }],
	members: [],
	seedImported: false
};

export const BOOKING_TYPE_LABELS: Record<string, string> = {
	L: "Sparkastenleerung",
	T: "Lottogewinn",
	A: "Auszahlung",
	S: "Sonderbuchung",
	G: "Gemeinschaftskasse"
};

export const BOOKING_FIELDS = [
	"objectId",
	"type",
	"label",
	"data",
	"person",
	"createdAt",
	"updatedAt"
];

export const COUNTRY_OPTIONS = ["DE", "AT", "CH", "LU", "IT", "FR", "NL", "BE"];
export const CURRENCY_OPTIONS = ["EUR", "CHF"];
