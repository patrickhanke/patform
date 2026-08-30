"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Page, usePageData } from "@repo/ui";
import { ClubClass, PageState } from "@repo/types";
import { useAppContext, useGetData } from "@repo/provider";
import { clubDetailFields, clubSiteStates } from "./constants/siteStates";
import { normalizeClub } from "./functions/factories";
import useClubRelatedData from "./hooks/useClubRelatedData";
import General from "./content/General";
import TrainingTimes from "./content/TrainingTimes";
import SignUps from "./content/SignUps";
import Players from "./content/Players";

const Club = () => {
	const { club_id: clubId } = useParams<{ club_id: string }>();
	const { project } = useAppContext();
	const [siteState, setSiteState] = useState<PageState>(
		clubSiteStates[0] as PageState
	);

	const { data, refetch } = useGetData({
		objectName: "Club",
		fields: clubDetailFields,
		id: clubId
	});

	const club = normalizeClub(data as ClubClass | null);
	const related = useClubRelatedData(project?.objectId);

	const { data: pageClub } = usePageData<ClubClass>(
		{
			initialData: club ?? undefined,
			objectId: clubId
		},
		{
			className: "Club",
			updateObject: (pageClubData) => ({
				title: pageClubData.title,
				contact: pageClubData.contact || "",
				email: pageClubData.email || "",
				homepage: pageClubData.homepage || "",
				logo: pageClubData.logo || "",
				short: pageClubData.short || "",
				training: pageClubData.training || [],
				playerIds: pageClubData.playerIds || []
			}),
			message: "Verein gespeichert"
		}
	);

	if (!club) {
		return (
			<Page title="Verein" emptyContent>
				<p>Lädt ...</p>
			</Page>
		);
	}

	return (
		<Page
			title={pageClub?.title || club.title || "Verein"}
			description={pageClub?.short || club.short}
			emptyContent
			refetch={refetch}
			pageStates={clubSiteStates}
			pageState={
				clubSiteStates.find((state) => state.value === siteState.value) ||
				clubSiteStates[0]
			}
			setPageState={setSiteState}
		>
			{siteState.value === "general" && <General related={related} />}
			{siteState.value === "training" && (
				<TrainingTimes related={related} />
			)}
			{siteState.value === "signups" && <SignUps related={related} />}
			{siteState.value === "players" && <Players related={related} />}
		</Page>
	);
};

export default Club;
