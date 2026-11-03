import { PageState } from "@repo/types";

export const championshipSiteStates: PageState[] = [
	{ value: "settings", label: "Einstellungen" },
	{ value: "matchdays", label: "Spieltage" },
	{ value: "teams", label: "Mannschaften" },
	{ value: "groups", label: "Gruppen" },
	{ value: "games", label: "Spiele" },
	{ value: "results", label: "Ergebnisse" },
	{ value: "players", label: "Spieler:innen" },
	{ value: "referees", label: "Schiedsrichter:innen" },
	{ value: "media", label: "Medien" },
	{ value: "import", label: "Import" }
];

export const championshipDetailFields = [
	"objectId",
	"title",
	"text",
	"documents",
	"gallery",
	"categories",
	"category",
	"short",
	"slug",
	"group_mode",
	"secondary_teams",
	"settings",
	"data",
	"createdAt",
	"updatedAt",
	"label"
];
