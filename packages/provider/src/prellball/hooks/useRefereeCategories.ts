"use client";

import { useMemo } from "react";
import { useFindData } from "@repo/provider";
import { CategoryClass } from "@repo/types";
export const REFEREE_CATEGORY_ID = "e443cb0a-5a3a-4d05-b74b-f0ec2cb8911c";

const useRefereeCategories = (projectId?: string) => {
	const { data } = useFindData<CategoryClass>({
		objectName: "Category",
		fields: [
			"objectId",
			"title",
			"label",
			"key",
			"category_id",
			"description"
		],
		projectId,
		filters: [
			{
				key: "category_id",
				value: REFEREE_CATEGORY_ID,
				operator: "equalTo"
			}
		],
		limit: 300,
		skipQuery: !projectId
	});

	return useMemo(
		() =>
			((data || []) as CategoryClass[])
				.filter((item) => item.category_id === REFEREE_CATEGORY_ID)
				.sort((a, b) =>
					(a.title || a.label || "").localeCompare(
						b.title || b.label || "",
						"de"
					)
				),
		[data]
	);
};

export default useRefereeCategories;
