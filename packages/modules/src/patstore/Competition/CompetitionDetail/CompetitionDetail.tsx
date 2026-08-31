"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Page } from "@repo/ui";
import { PageState } from "@repo/types";
import { useAppContext, useGetData } from "@repo/provider";
import {
	CompetitionDetailFields,
	CompetitionSiteStates
} from "./constants/siteStates";
import { CompetitionClass } from "@repo/types";
import { normalizeCompetition } from "./functions/factories";
import useCompetitionUpdate from "./hooks/useCompetitionUpdate";
import useCompetitionRelatedData from "./hooks/useCompetitionRelatedData";
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
import { CompetitionTabProps } from "./types";

const CompetitionDetail = () => {
	const { competition_id: competitionId } = useParams<{
		competition_id: string;
	}>();
	const { project } = useAppContext();
	const [siteState, setSiteState] = useState<PageState>(
		CompetitionSiteStates[0] as PageState
	);

	const { data, refetch } = useGetData({
		objectName: "Competition",
		fields: CompetitionDetailFields,
		id: competitionId
	});

	const Competition = normalizeCompetition(
		data as CompetitionClass | null
	);
	const related = useCompetitionRelatedData(project?.objectId);
	const { onUpdate, loading } = useCompetitionUpdate(
		competitionId,
		refetch
	);

	const pageStates = useMemo(() => {
		return CompetitionSiteStates.filter((state) => {
			if (state.value === "schedule") {
				return (Competition?.matchdays.length || 0) > 0;
			}
			if (state.value === "import") {
				return Competition ? !Competition.group_mode : false;
			}
			return true;
		});
	}, [Competition]);

	const tabProps: CompetitionTabProps | null = Competition
		? { Competition, related, onUpdate, loading }
		: null;

	if (!Competition) {
		return (
			<Page title="Meisterschaft" emptyContent>
				<p>Lädt ...</p>
			</Page>
		);
	}

	return (
		<Page
			title={Competition.title || "Meisterschaft"}
			description={Competition.season}
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

export default CompetitionDetail;
