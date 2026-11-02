import { ChampionshipGameType } from "@repo/types";

export const championshipGameTypes: {
	value: ChampionshipGameType;
	label: string;
	short: string;
}[] = [
	{ value: "grp", label: "Gruppenspiel", short: "Gruppe" },
	{ value: "krz", label: "Kreuzspiel", short: "Kreuz" },
	{ value: "plz", label: "Platzierungsspiel", short: "Platz" },
	{ value: "ent", label: "Entscheidungsspiel", short: "Entsch." },
	{ value: "akk", label: "Außer Konkurrenz", short: "a. K." }
];

export const DEFAULT_MAX_CONSECUTIVE_PASSES = 2;
