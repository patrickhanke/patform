import { PageState } from "@repo/types";

export const championshipSiteStates: PageState[] = [
	{ value: "settings", label: "Einstellungen" },
	{ value: "matchdays", label: "Spieltage" },
	{ value: "teams", label: "Mannschaften" },
	{ value: "groups", label: "Gruppen" },
	{ value: "games", label: "Spiele" },
	{ value: "schedule", label: "Spielplan" },
	{ value: "placements", label: "Platzierungen" },
	{ value: "results", label: "Ergebnisse" },
	{ value: "players", label: "Spieler*innen" },
	{ value: "media", label: "Medien" },
	{ value: "import", label: "Import" }
];

export const championshipDetailFields = [
	"objectId",
	"title",
	"season",
	"deadline",
	"show_class",
	"ak_games",
	"info",
	"director",
	"email",
	"open_signup",
	"free_signup",
	"secondary_teams",
	"group_mode",
	"classes",
	"gallery",
	"article_id",
	"matchdays",
	"signups",
	"groups",
	"games",
	"createdAt",
	"updatedAt"
];
