"use client";

import { useFindData } from "@repo/provider";
import {
	ChampionshipClass,
	ClubClass,
	GroupClass,
	LocationClass,
	PersonClass
} from "@repo/types";
import { ClubRelatedData } from "../types";

const useClubRelatedData = (projectId?: string): ClubRelatedData => {
	const { data: clubs } = useFindData({
		objectName: "Club",
		fields: ["objectId", "title", "short"],
		projectId,
		limit: 500,
		skipQuery: !projectId
	});
	const { data: people, refetch: refetchPeople } = useFindData({
		objectName: "Person",
		fields: ["objectId", "title", "portrait", "email", "label"],
		projectId,
		limit: 500,
		skipQuery: !projectId
	});
	const { data: locations } = useFindData({
		objectName: "Location",
		fields: ["objectId", "title", "address"],
		projectId,
		limit: 500,
		skipQuery: !projectId
	});
	const { data: groups } = useFindData({
		objectName: "Group",
		fields: ["objectId", "title"],
		projectId,
		limit: 500,
		skipQuery: !projectId
	});
	const { data: championships, refetch: refetchChampionships } = useFindData({
		objectName: "Championship",
		fields: [
			"objectId",
			"title",
			"season",
			"deadline",
			"classes",
			"open_signup",
			"free_signup",
			"signups"
		],
		projectId,
		limit: 500,
		skipQuery: !projectId
	});

	return {
		clubs: (clubs || []) as ClubClass[],
		people: (people || []) as PersonClass[],
		locations: (locations || []) as LocationClass[],
		groups: (groups || []) as GroupClass[],
		championships: (championships || []) as ChampionshipClass[],
		refetchChampionships,
		refetchPeople
	};
};

export default useClubRelatedData;
