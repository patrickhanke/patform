"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Page, usePageData } from "@repo/ui";
import {
	ChampionshipClass,
	LocationClass,
	PageState,
	PersonClass,
	PrellballClubClass
} from "@repo/types";
import { useAppContext, useFindData, useGetData } from "@repo/provider";
import useSeasonCategories from "../../hooks/useSeasonCategories";
import { clubUpdateObject, normalizeClub } from "../functions/club";
import General from "./content/General";
import TrainingTimes from "./content/TrainingTimes";
import { SignUps } from "./content";
import Players from "./content/Players";

const siteStates: PageState[] = [
	{ value: "general", label: "Überblick" },
	{ value: "training", label: "Trainingszeiten" },
	{ value: "signups", label: "Meldungen" },
	{ value: "players", label: "Spieler:innen" }
];

const detailFields = [
	"objectId",
	"title",
	"file { name url }",
	"settings",
	"data",
	"categories",
	"label",
	"createdAt",
	"updatedAt"
];

const PrellballClub = () => {
	const { club_id: clubId } = useParams<{ club_id: string }>();
	const { project } = useAppContext();
	const seasons = useSeasonCategories(project?.objectId);
	console.log("seasons", seasons);
	const [siteState, setSiteState] = useState<PageState>(siteStates[0]!);
	const [seasonId, setSeasonId] = useState("");
	const { data, refetch } = useGetData<PrellballClubClass>({
		objectName: "Club",
		fields: detailFields,
		id: clubId
	});
	const club = useMemo(
		() => normalizeClub((data as PrellballClubClass | null) ?? null),
		[data]
	);
	const { data: clubs } = useFindData<PrellballClubClass>({
		objectName: "Club",
		fields: ["objectId", "title", "settings"],
		projectId: project?.objectId,
		limit: 500,
		skipQuery: !project?.objectId
	});
	const { data: locations } = useFindData<LocationClass>({
		objectName: "Location",
		fields: ["objectId", "title", "address"],
		projectId: project?.objectId,
		limit: 500,
		skipQuery: !project?.objectId
	});
	const { data: championships, refetch: refetchChampionships } =
		useFindData<ChampionshipClass>({
			objectName: "Championship",
			fields: ["objectId", "title", "categories", "settings", "data"],
			projectId: project?.objectId,
			limit: 300,
			skipQuery: !project?.objectId
		});
	const { data: people, refetch: refetchPeople } = useFindData<PersonClass>({
		objectName: "Person",
		fields: ["objectId", "name", "label", "categories", "data"],
		projectId: project?.objectId,
		limit: 1000,
		skipQuery: !project?.objectId
	});

	usePageData<PrellballClubClass>(
		{ initialData: club ?? undefined, objectId: clubId },
		{
			className: "Club",
			updateObject: clubUpdateObject,
			message: "Verein gespeichert"
		}
	);

	console.log(seasonId);
	const activeSeason =
		seasonId ||
		seasons.find((season) =>
			(club?.categories || []).includes(season.objectId)
		)?.objectId ||
		seasons[0]?.objectId ||
		"";

	if (!club) {
		return (
			<Page title="Verein" emptyContent>
				<p>Lädt ...</p>
			</Page>
		);
	}

	return (
		<Page
			title={club.title || "Verein"}
			description={club.settings.short}
			emptyContent
			refetch={refetch}
			pageStates={siteStates}
			pageState={
				siteStates.find((state) => state.value === siteState.value) ||
				siteStates[0]
			}
			setPageState={setSiteState}
		>
			{siteState.value === "general" && (
				<General clubs={(clubs || []) as PrellballClubClass[]} />
			)}
			{siteState.value === "training" && (
				<TrainingTimes
					locations={(locations || []) as LocationClass[]}
				/>
			)}
			{siteState.value === "signups" && (
				<SignUps
					clubId={club.objectId}
					seasonId={activeSeason}
					seasons={seasons}
					onSeason={setSeasonId}
					championships={(championships || []) as ChampionshipClass[]}
					people={(people || []) as PersonClass[]}
					refetchChampionships={refetchChampionships}
				/>
			)}
			{siteState.value === "players" && (
				<Players
					clubId={club.objectId}
					people={(people || []) as PersonClass[]}
					refetchPeople={refetchPeople}
				/>
			)}
		</Page>
	);
};

export default PrellballClub;
