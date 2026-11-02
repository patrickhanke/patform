import { useMemo } from "react";
import { ClubClass } from "@repo/types";
import { ChampionshipPageModel } from "../../../../types";
import { DivisionCategory } from "../../../../../functions/divisions";
import { DEFAULT_MAX_CONSECUTIVE_PASSES } from "../constants/gameTypes";
import { buildScheduleModel, placementsOf } from "../functions/scheduleModel";
import { analyzeSchedule } from "../functions/validateSchedule";
import { evaluateTargets } from "../functions/optimizeSchedule";
import { ScheduleLabelContext, ScheduleOptions } from "../types";

const useSchedule = ({
	page,
	matchDayId,
	clubs,
	divisions,
	selectedGameId
}: {
	page: ChampionshipPageModel;
	matchDayId: string;
	clubs: ClubClass[];
	divisions: DivisionCategory[];
	selectedGameId: string | null;
}) => {
	const matchDay = page.data.match_days.find(
		(item) => item.id === matchDayId
	);
	const allGames = page.data.games;
	const groups = page.data.groups;

	const dayGames = useMemo(
		() => allGames.filter((game) => game.match_day_id === matchDayId),
		[allGames, matchDayId]
	);

	const options: ScheduleOptions = useMemo(
		() => ({
			fields: Math.max(1, matchDay?.fields || 1),
			maxConsecutive:
				page.settings.max_consecutive_passes ??
				DEFAULT_MAX_CONSECUTIVE_PASSES
		}),
		[matchDay?.fields, page.settings.max_consecutive_passes]
	);

	const model = useMemo(
		() => buildScheduleModel(dayGames, allGames, groups),
		[dayGames, allGames, groups]
	);
	const placements = useMemo(() => placementsOf(dayGames), [dayGames]);
	const analysis = useMemo(
		() => analyzeSchedule(model, placements, options),
		[model, placements, options]
	);

	const passes = Math.max(analysis.lastPass, matchDay?.passes || 0, 1) + 1;
	const columns = Math.max(
		options.fields,
		...dayGames.map((game) => game.field || 1)
	);

	const evaluation = useMemo(
		() =>
			selectedGameId
				? evaluateTargets(
						model,
						placements,
						options,
						selectedGameId,
						passes
					)
				: { targets: {}, suggestions: [] },
		[model, placements, options, selectedGameId, passes]
	);

	const labelContext: ScheduleLabelContext = useMemo(
		() => ({
			groups,
			signups: page.data.sign_ups,
			clubs,
			games: allGames,
			showClass: page.settings.show_division,
			divisions
		}),
		[
			groups,
			page.data.sign_ups,
			clubs,
			allGames,
			page.settings.show_division,
			divisions
		]
	);

	return {
		matchDay,
		dayGames,
		options,
		model,
		placements,
		analysis,
		passes,
		columns,
		targets: evaluation.targets,
		suggestions: evaluation.suggestions,
		labelContext
	};
};

export type ScheduleState = ReturnType<typeof useSchedule>;

export default useSchedule;
