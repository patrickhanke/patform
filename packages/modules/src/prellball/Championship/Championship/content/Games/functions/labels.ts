import { signupLabel } from "../../../../functions/signups";
import {
	GamePrerequisite,
	Participant,
	ScheduleIssue,
	ScheduleLabelContext
} from "../types";
import { gameResultLabel } from "./gameSlot";

export const subgroupName = (
	subgroupId: string | undefined,
	context: ScheduleLabelContext
) => {
	for (const group of context.groups) {
		const subgroup = group.subgroups.find((item) => item.id === subgroupId);
		if (!subgroup) continue;
		return group.subgroups.length > 1
			? `${group.name} · ${subgroup.label}`
			: group.name || subgroup.label;
	}
	return "Gruppe";
};

export const gameNumber = (gameId: string, context: ScheduleLabelContext) => {
	const game = context.games.find((item) => item.id === gameId);
	return game ? `Sp. ${game.game_nr}` : "Sp. ?";
};

export const participantLabel = (
	participant: Participant | undefined,
	context: ScheduleLabelContext
) => {
	if (!participant) return "—";
	if (participant.kind === "game" && participant.gameId) {
		const result = gameResultLabel(participant.index) || "Ergebnis";
		return `${result} ${gameNumber(participant.gameId, context)}`;
	}
	if (participant.kind === "place") {
		return `${participant.index}. ${subgroupName(participant.subgroupId, context)}`;
	}
	const signup = context.signups.find(
		(item) => item.id === participant.signupId
	);
	if (signup) {
		return signupLabel(
			signup,
			context.signups,
			context.clubs,
			context.showClass,
			context.divisions
		);
	}
	return `${subgroupName(participant.subgroupId, context)} ${participant.index ?? ""}.`;
};

export const prerequisiteLabel = (
	prerequisite: GamePrerequisite,
	context: ScheduleLabelContext
) =>
	prerequisite.kind === "subgroup"
		? `${subgroupName(prerequisite.subgroupId, context)} abgeschlossen`
		: `${gameResultLabel(prerequisite.index) || "Ergebnis"} ${gameNumber(prerequisite.gameId, context)}`;

const passRange = (passes: number[]) => {
	const first = passes[0];
	const last = passes[passes.length - 1];
	return first === last ? `${first}` : `${first}–${last}`;
};

export const issueMessage = (
	issue: ScheduleIssue,
	context: ScheduleLabelContext,
	participants: Record<string, Participant>,
	maxConsecutive: number
) => {
	const who = issue.participant
		? participantLabel(participants[issue.participant], context)
		: "";
	const games = issue.gameIds.map((id) => gameNumber(id, context)).join(", ");
	const pass = passRange(issue.passes);
	switch (issue.kind) {
		case "team_double":
			return `${who} ist in Durchgang ${pass} mehrfach eingeteilt (${games}).`;
		case "referee_double":
			return `${who} pfeift in Durchgang ${pass} mehrere Spiele (${games}).`;
		case "field_double":
			return `${games} belegen in Durchgang ${pass} dasselbe Feld.`;
		case "field_range":
			return `${games} liegt außerhalb der verfügbaren Felder.`;
		case "dependency": {
			const blockers = (issue.blockers || [])
				.map((id) => gameNumber(id, context))
				.join(", ");
			return `${games} (Dg. ${pass}) wartet auf ${blockers}, die nicht vorher beendet sind.`;
		}
		case "streak":
			return `${who} spielt in Durchgang ${pass} ohne Pause (max. ${maxConsecutive}).`;
	}
};
