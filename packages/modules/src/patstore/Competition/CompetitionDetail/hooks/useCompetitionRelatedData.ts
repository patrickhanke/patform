"use client";

import { useFindData } from "@repo/provider";
import { ClubClass, EventClass, PersonClass } from "@repo/types";
import { CompetitionRelatedData } from "../types";

const useCompetitionRelatedData = (
	projectId?: string
): CompetitionRelatedData => {
	const { data: clubs } = useFindData({
		objectName: "Club",
		fields: ["objectId", "title", "short", "logo"],
		projectId,
		limit: 500,
		skipQuery: !projectId
	});
	const { data: events } = useFindData({
		objectName: "Event",
		fields: ["objectId", "title", "dates", "location"],
		projectId,
		limit: 500,
		skipQuery: !projectId
	});
	const { data: people } = useFindData({
		objectName: "Person",
		fields: ["objectId", "title", "portrait", "email"],
		projectId,
		limit: 500,
		skipQuery: !projectId
	});

	return {
		clubs: (clubs || []) as ClubClass[],
		events: (events || []) as EventClass[],
		people: (people || []) as PersonClass[]
	};
};

export default useCompetitionRelatedData;
