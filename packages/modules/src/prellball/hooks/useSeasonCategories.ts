"use client";

import { useFindData } from "@repo/provider";
import { CategoryClass } from "@repo/types";

const SEASON_CATEGORY_KEY = "saison";

const useSeasonCategories = (projectId?: string) => {
	const { data } = useFindData<CategoryClass>({
		objectName: "Category",
		fields: ["objectId", "title", "key"],
		filters: [
			{
				id: "type",
				key: "type",
				operator: "equalTo",
				value: SEASON_CATEGORY_KEY
			}
		],
		projectId,
		limit: 300,
		skipQuery: !projectId
	});

	console.log("season data", data);
	return data || [];
};

export default useSeasonCategories;
