"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Page } from "@repo/ui";
import { PageState } from "@repo/types";
import { useAppContext, useGetData } from "@repo/provider";
import {
	championshipDetailFields,
	championshipSiteStates
} from "./constants/siteStates";
import { ChampionshipClass } from "@repo/types";
import { normalizeChampionship } from "./functions/factories";
import useChampionshipUpdate from "./hooks/useChampionshipUpdate";
import useChampionshipRelatedData from "./hooks/useChampionshipRelatedData";
import Settings from "./content/Settings";
import Matchdays from "./content/Matchdays";
import Teams from "./content/Teams";
import Groups from "./content/Groups";
import Games from "./content/Games";
import Schedule from "./content/Schedule";
import Placements from "./content/Placements";
import Results from "./content/Results";
import Players from "./content/Players";
import Media from "./content/Media";
import ImportTab from "./content/Import";
import { ChampionshipTabProps } from "./types";

const ChampionshipDetail = () => {
	const { championship_id: championshipId } = useParams<{
		championship_id: string;
	}>();
	const { project } = useAppContext();
	const [siteState, setSiteState] = useState<PageState>(
		championshipSiteStates[0] as PageState
	);

	const { data, refetch } = useGetData({
		objectName: "Championship",
		fields: championshipDetailFields,
		id: championshipId
	});

	const championship = normalizeChampionship(
		data as ChampionshipClass | null
	);
	const related = useChampionshipRelatedData(project?.objectId);
	const { onUpdate, loading } = useChampionshipUpdate(
		championshipId,
		refetch
	);

	const pageStates = useMemo(() => {
		return championshipSiteStates.filter((state) => {
			if (state.value === "schedule") {
				return (championship?.matchdays.length || 0) > 0;
			}
			if (state.value === "import") {
				return championship ? !championship.group_mode : false;
			}
			return true;
		});
	}, [championship]);

	const tabProps: ChampionshipTabProps | null = championship
		? { championship, related, onUpdate, loading }
		: null;

	if (!championship) {
		return (
			<Page title="Meisterschaft" emptyContent>
				<p>Lädt ...</p>
			</Page>
		);
	}

	return (
		<Page
			title={championship.title || "Meisterschaft"}
			description={championship.season}
			emptyContent
			refetch={refetch}
			pageStates={pageStates}
			pageState={
				pageStates.find((state) => state.value === siteState.value) ||
				pageStates[0]
			}
			setPageState={setSiteState}
		>
			{tabProps && siteState.value === "settings" && (
				<Settings {...tabProps} />
			)}
			{tabProps && siteState.value === "matchdays" && (
				<Matchdays {...tabProps} />
			)}
			{tabProps && siteState.value === "teams" && <Teams {...tabProps} />}
			{tabProps && siteState.value === "groups" && (
				<Groups {...tabProps} />
			)}
			{tabProps && siteState.value === "games" && <Games {...tabProps} />}
			{tabProps && siteState.value === "schedule" && (
				<Schedule {...tabProps} />
			)}
			{tabProps && siteState.value === "placements" && (
				<Placements {...tabProps} />
			)}
			{tabProps && siteState.value === "results" && (
				<Results {...tabProps} />
			)}
			{tabProps && siteState.value === "players" && (
				<Players {...tabProps} />
			)}
			{tabProps && siteState.value === "media" && <Media {...tabProps} />}
			{tabProps && siteState.value === "import" && (
				<ImportTab {...tabProps} />
			)}
		</Page>
	);
};

export default ChampionshipDetail;
