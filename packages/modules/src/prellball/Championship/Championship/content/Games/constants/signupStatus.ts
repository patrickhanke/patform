import { ChampionshipSignUpStatus } from "@repo/types";

export const signupStatusLabel: Record<ChampionshipSignUpStatus, string> = {
	erstellt: "erstellt",
	eingeladen: "eingeladen",
	eingereicht: "eingereicht",
	gemeldet: "gemeldet",
	abgelehnt: "abgelehnt",
	none: "kein Status"
};
