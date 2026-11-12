import { PersonClass } from "@repo/types";
import {
	ChampionshipPageModel,
	ChampionshipRelatedData
} from "../../../../types";
import {
	DivisionCategory,
	mergedPersonData,
	playedGameCount,
	signupLabel
} from "@repo/provider";

export type PlayerExportRow = {
	name: string;
	team: string;
	dtbId: string;
	games: number;
};

export const exportDateSuffix = () => {
	const now = new Date();
	return `${now.getDate().toString()}-${now.getMonth().toString()}-${now.getFullYear().toString()}`;
};

export const buildPlayerExportRows = (
	people: PersonClass[],
	page: ChampionshipPageModel,
	related: ChampionshipRelatedData,
	seasonId: string,
	divisions: DivisionCategory[]
): PlayerExportRow[] => {
	const signups = page.data.sign_ups;
	const drafts = page.person_drafts || {};
	const showDivision = page.settings.show_division;

	return people.map((person) => {
		const signup = signups.find((item) =>
			item.person_ids.includes(person.objectId)
		);
		const data = mergedPersonData(person, drafts);
		const games = playedGameCount(data, seasonId);
		return {
			name: person.name || person.label || "",
			team: signup
				? signupLabel(
						signup,
						signups,
						related.clubs,
						showDivision,
						divisions
					)
				: "—",
			dtbId: data.dtb_id || "",
			games
		};
	});
};
