"use client";

import { useFindData } from "@repo/provider";
import { EventClass, NewsClass, PersonClass } from "@repo/types";
import { ChampionshipRelatedData } from "../types";

const useChampionshipRelatedData = (
	projectId?: string
): ChampionshipRelatedData => {
	const { data: entries } = useFindData<NewsClass>({
		objectName: "Entry",
		fields: ["objectId", "title", "image"],
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
		entries: entries || [],
		events: events || [],
		people: people || []
	};
};

export default useChampionshipRelatedData;
