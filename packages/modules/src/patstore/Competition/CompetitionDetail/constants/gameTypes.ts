import { CompetitionGameType } from "@repo/types";

export const CompetitionGameTypes: {
	value: CompetitionGameType;
	label: string;
}[] = [
	{ value: "grp", label: "Gruppenspiel" },
	{ value: "krz", label: "Kreuzspiel" },
	{ value: "plz", label: "Platzierungsspiel" },
	{ value: "ent", label: "Entscheidungsspiel" },
	{ value: "akk", label: "Außer Konkurrenz" }
];
