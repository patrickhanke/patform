import { PageState } from "@repo/types";

export const clubSiteStates: PageState[] = [
	{ value: "general", label: "Überblick" },
	{ value: "training", label: "Trainingszeiten" },
	{ value: "signups", label: "Meldungen" },
	{ value: "players", label: "Spieler*innen" }
];

export const clubDetailFields = [
	"objectId",
	"title",
	"contact",
	"email",
	"homepage",
	"logo",
	"short",
	"training",
	"playerIds",
	"createdAt",
	"updatedAt"
];
