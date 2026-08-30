"use client";

import { useFindData } from "@repo/provider";
import { ClubClass, EventClass, PersonClass } from "@repo/types";
import { ChampionshipRelatedData } from "../types";

const useChampionshipRelatedData = (
	projectId?: string
): ChampionshipRelatedData => {
	const { data: clubs } = useFindData<ClubClass>({
		objectName: "Club",
		fields: ["objectId", "title", "short", "logo"],
		projectId,
		limit: 500,
		skipQuery: !projectId
	});
	const { data: events } = useFindData<EventClass>({
		objectName: "Event",
		fields: ["objectId", "title", "dates", "location"],
		projectId,
		limit: 500,
		skipQuery: !projectId
	});
	const { data: people } = useFindData<PersonClass>({
		objectName: "Person",
		fields: ["objectId", "title", "portrait", "email"],
		projectId,
		limit: 500,
		skipQuery: !projectId
	});

	return {
		clubs: clubs || [],
		events: events || [],
		people: people || []
	};
};

export default useChampionshipRelatedData;
