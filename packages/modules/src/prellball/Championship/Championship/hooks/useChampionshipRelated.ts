"use client";

import { useFindData } from "@repo/provider";
import {
	ArticleClass,
	ClubClass,
	DownloadClass,
	LocationClass,
	PatstoreUser,
	PersonClass
} from "@repo/types";
import { ChampionshipRelatedData } from "../../types";

const useChampionshipRelated = (
	projectId?: string
): ChampionshipRelatedData => {
	const skipQuery = !projectId;
	const { data: clubs } = useFindData<ClubClass>({
		objectName: "Club",
		fields: ["objectId", "title", "settings", "file { name url }"],
		projectId,
		limit: 500,
		skipQuery
	});
	const { data: locations } = useFindData<LocationClass>({
		objectName: "Location",
		fields: ["objectId", "title", "address"],
		projectId,
		limit: 500,
		skipQuery
	});
	const { data: people, refetch: refetchPeople } = useFindData<PersonClass>({
		objectName: "Person",
		fields: ["objectId", "name", "portrait", "email", "data", "label"],
		projectId,
		limit: 1500,
		skipQuery
	});
	const { data: articles } = useFindData<ArticleClass>({
		objectName: "Article",
		fields: ["objectId", "title", "date"],
		projectId,
		limit: 500,
		skipQuery
	});
	const { data: downloads } = useFindData<DownloadClass>({
		objectName: "Download",
		fields: ["objectId", "title"],
		projectId,
		limit: 500,
		skipQuery
	});
	const { data: users } = useFindData({
		objectName: "User",
		fields: ["objectId", "username", "email"],
		projectId,
		limit: 500,
		skipQuery
	});

	return {
		clubs: clubs || [],
		locations: locations || [],
		people: people || [],
		articles: articles || [],
		downloads: downloads || [],
		users: (users || []) as unknown as PatstoreUser[],
		refetchPeople
	};
};

export default useChampionshipRelated;
