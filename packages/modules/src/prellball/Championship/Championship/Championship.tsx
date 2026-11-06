"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Page, usePageData } from "@repo/ui";
import { ChampionshipClass, PageState, PrellballPersonData } from "@repo/types";
import {
	useAppContext,
	useDataHandlerSecure,
	useGetData
} from "@repo/provider";
import {
	championshipDetailFields,
	championshipSiteStates
} from "./constants/siteStates";
import { normalizeChampionship } from "../functions/normalize";
import { championshipUpdateObject } from "../functions/updateObject";
import { readPersonData } from "../functions/person";
import useChampionshipRelated from "./hooks/useChampionshipRelated";
import { ChampionshipPageModel } from "../types";
import useSeasonCategories from "../../hooks/useSeasonCategories";
import { seasonCategoryTitle } from "../../functions/season";
import {
	Groups,
	Games,
	Settings,
	MatchDays,
	Teams,
	Players,
	Referees,
	Media,
	Import,
	Results
} from "./content";

const Championship = () => {
	const { championship_id: championshipId } = useParams<{
		championship_id: string;
	}>();
	const { project } = useAppContext();
	const seasons = useSeasonCategories(project?.objectId);
	const [siteState, setSiteState] = useState<PageState>(
		championshipSiteStates[0] ?? {
			value: "settings",
			label: "Einstellungen"
		}
	);
	const { updateData } = useDataHandlerSecure();
	const { data, refetch, error } = useGetData<ChampionshipClass>({
		objectName: "Championship",
		fields: championshipDetailFields,
		id: championshipId
	});

	const championship = useMemo(
		() => normalizeChampionship((data as ChampionshipClass | null) ?? null),
		[data]
	);
	const related = useChampionshipRelated(
		championship?.project?.objectId || project?.objectId
	);

	usePageData<ChampionshipPageModel>(
		{
			initialData: championship ?? undefined,
			objectId: championshipId
		},
		{
			className: "Championship",
			updateObject: championshipUpdateObject,
			message: "Wettkampf gespeichert",
			afterSave: async (page) => {
				const drafts = Object.entries(page.person_drafts || {});
				if (drafts.length === 0) return;
				await Promise.all(
					drafts.map(([personId, draft], index) => {
						const person = related.people.find(
							(item) => item.objectId === personId
						);
						const nextData: PrellballPersonData = {
							...readPersonData(person),
							...draft
						};
						return updateData({
							className: "Person",
							objectId: personId,
							updateObject: { data: nextData },
							feedback:
								index === 0
									? "Spieler:innen gespeichert"
									: undefined
						});
					})
				);
				await related.refetchPeople();
			}
		}
	);

	if (!championship) {
		return (
			<Page title="Wettkampf" emptyContent>
				<p>
					{error
						? "Der Wettkampf konnte nicht geladen werden."
						: "Lädt ..."}
				</p>
			</Page>
		);
	}

	return (
		<Page
			title={championship.title || "Wettkampf"}
			description={seasonCategoryTitle(championship.categories, seasons)}
			emptyContent
			refetch={refetch}
			pageStates={championshipSiteStates}
			pageState={
				championshipSiteStates.find(
					(state) => state.value === siteState.value
				) || siteState
			}
			setPageState={setSiteState}
		>
			{siteState.value === "settings" && <Settings related={related} />}
			{siteState.value === "matchdays" && <MatchDays related={related} />}
			{siteState.value === "teams" && <Teams related={related} />}
			{siteState.value === "groups" && <Groups related={related} />}
			{siteState.value === "games" && <Games related={related} />}
			{siteState.value === "results" && <Results related={related} />}
			{siteState.value === "players" && <Players related={related} />}
			{siteState.value === "referees" && <Referees related={related} />}
			{siteState.value === "media" && <Media related={related} />}
			{siteState.value === "import" && <Import />}
		</Page>
	);
};

export default Championship;
