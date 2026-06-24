export const CREATE_RECORD_STEPS = [
	{ value: "user", label: "Mitarbeiter" },
	{ value: "start_date", label: "Startdatum" },
	{ value: "import", label: "Datenquelle" },
	{ value: "time_settings", label: "Zeiteinstellungen" },
	{ value: "surcharges", label: "Zuschläge & Feiertage" }
] as const;

export const MONTH_NAMES = [
	"Januar",
	"Februar",
	"März",
	"April",
	"Mai",
	"Juni",
	"Juli",
	"August",
	"September",
	"Oktober",
	"November",
	"Dezember"
] as const;
