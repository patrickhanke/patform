"use client";

import { useMemo } from "react";
import { useFindData } from "@repo/provider";
import { CategoryClass } from "@repo/types";
import { DIVISION_CATEGORY_ID, DivisionCategory } from "../functions/divisions";

const useDivisionCategories = (projectId?: string) => {
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
				value: DIVISION_CATEGORY_ID,
				operator: "equalTo"
			}
		],
		limit: 300,
		skipQuery: !projectId
	});

	return useMemo(
		() =>
			((data || []) as DivisionCategory[])
				.filter((item) => item.category_id === DIVISION_CATEGORY_ID)
				.sort((a, b) =>
					(a.title || a.label || "").localeCompare(
						b.title || b.label || "",
						"de"
					)
				),
		[data]
	);
};

export default useDivisionCategories;
