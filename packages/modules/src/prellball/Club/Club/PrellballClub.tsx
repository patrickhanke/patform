"use client";

import { useCallback, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Page, PageHeaderButton, usePageData } from "@repo/ui";
import {
	ChampionshipClass,
	LocationClass,
	PageState,
	PersonClass,
	PrellballClubClass
} from "@repo/types";
import { useAppContext, useFindData, useGetData } from "@repo/provider";
import useSeasonCategories from "../../hooks/useSeasonCategories";
import { clubKind, clubUpdateObject, normalizeClub } from "../functions/club";
import TrainingTimes from "./content/TrainingTimes";
import { General, SignUps } from "./content";
import Players from "./content/Players";
import Unions from "./content/Unions";
import { checkUnionRights, primaryClubChanged } from "../functions/unionRights";
import { currentSeasonId } from "../../functions/season";

const generalState: PageState = { value: "general", label: "Überblick" };
const trainingState: PageState = {
	value: "training",
	label: "Trainingszeiten"
};
const signupsState: PageState = { value: "signups", label: "Meldungen" };
const playersState: PageState = { value: "players", label: "Spieler:innen" };
const unionsState: PageState = {
	value: "unions",
	label: "Spielgemeinschaften"
};

const clubStates: PageState[] = [
	generalState,
	trainingState,
	signupsState,
	playersState,
	unionsState
];

/** Spielgemeinschaften have no training times of their own. */
const unionStates: PageState[] = [generalState, signupsState, playersState];

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
	const { project } = useAppContext<"patstore">();
	const seasons = useSeasonCategories(project?.objectId);
	const [siteState, setSiteState] = useState<PageState>(generalState);
	const [seasonId, setSeasonId] = useState("");
	const [createTraining, setCreateTraining] = useState(false);
	const closeTrainingCreate = useCallback(
		() => setCreateTraining(false),
		[]
	);
	const [createPlayer, setCreatePlayer] = useState(false);
	const closePlayerCreate = useCallback(() => setCreatePlayer(false), []);

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
		fields: ["objectId", "title", "settings", "categories"],
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
		filters: [
			{
				key: "categories",
				operator: "contains",
				value: [clubId]
			}
		],
		projectId: project?.objectId,
		limit: 1000,
		skipQuery: !project?.objectId
	});

	usePageData<PrellballClubClass>(
		{ initialData: club ?? undefined, objectId: clubId },
		{
			className: "Club",
			updateObject: clubUpdateObject,
			message: "Verein gespeichert",
			afterSave: async (saved) => {
				if (primaryClubChanged(club, saved)) {
					await checkUnionRights();
				}
			}
		}
	);

	const isUnion = club ? clubKind(club.categories) === "union" : false;
	const pageHeaderButtons: PageHeaderButton[] = useMemo(() => {
		if (!club || isUnion) return [];
		if (siteState.value === "training") {
			return [
				{
					text: "Neue Trainingszeit erstellen",
					onClick: () => setCreateTraining(true),
					is_add_button: true
				}
			];
		}
		if (siteState.value === "players") {
			return [
				{
					text: "Spieler:in erstellen",
					onClick: () => setCreatePlayer(true),
					is_add_button: true
				}
			];
		}
		return [];
	}, [club, isUnion, siteState.value]);

	console.log(seasonId);
	const activeSeason =
		seasonId ||
		currentSeasonId(seasons) ||
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

	const siteStates = isUnion ? unionStates : clubStates;
	const activeState =
		siteStates.find((state) => state.value === siteState.value) ||
		siteStates[0]!;

	return (
		<Page
			title={club.title || (isUnion ? "Spielgemeinschaft" : "Verein")}
			description={club.settings.short}
			emptyContent
			refetch={refetch}
			pageHeaderButtons={pageHeaderButtons}
			pageStates={siteStates}
			pageState={activeState}
			setPageState={setSiteState}
		>
			{activeState.value === "general" && (
				<General
					clubs={(clubs || []) as PrellballClubClass[]}
					union={isUnion}
				/>
			)}
			{activeState.value === "training" && (
				<TrainingTimes
					locations={(locations || []) as LocationClass[]}
					createOpen={createTraining}
					onCreateClose={closeTrainingCreate}
				/>
			)}
			{activeState.value === "signups" && (
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
			{activeState.value === "players" && (
				<Players
					clubId={club.objectId}
					people={(people || []) as PersonClass[]}
					refetchPeople={refetchPeople}
					union={isUnion}
					createOpen={createPlayer}
					onCreateClose={closePlayerCreate}
				/>
			)}
			{activeState.value === "unions" && (
				<Unions
					clubId={club.objectId}
					clubs={(clubs || []) as PrellballClubClass[]}
					people={(people || []) as PersonClass[]}
					refetchPeople={refetchPeople}
				/>
			)}
		</Page>
	);
};

export default PrellballClub;
