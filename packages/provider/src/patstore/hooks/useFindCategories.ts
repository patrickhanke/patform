"use client";

import { useFindData } from "@repo/provider";
import { CategoryClass, Filter, ModuleCategory, SiteState } from "@repo/types";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";

export const filterModuleCategories = (categories: ModuleCategory[]) => {
	const filteredCategories = categories.filter(
		(category) => category.connected_class === "Category"
	);

	if (filteredCategories.length > 0) {
		const categoryIds: string[] = [];
		const categoryModuleId = filteredCategories[0]?.moduleId;
		filteredCategories.forEach((category) => {
			category.category_ids.forEach((categoryId) => {
				categoryIds.push(categoryId);
			});
		});
		return {
			categoryModuleId,
			categoryIds
		};
	}

	return {
		categoryModuleId: "",
		categoryIds: []
	};
};

export const useFindCategoryPageStates = ({
	categories,
	categoryModuleId,
	filters,
	setFilters
}: {
	categories: string[];
	categoryModuleId?: string;
	filters: Filter[];
	setFilters: Dispatch<SetStateAction<Filter[]>>;
}) => {
	const [activePage, setActivePage] = useState<SiteState | undefined>();

	const { data, loading } = useFindData({
		objectName: "Category",
		fields: [
			"objectId",
			"label",
			"title",
			"category_id",
			"description",
			"color"
		],
		filters: [
			{
				id: "category_id",
				key: "category_id",
				value: categories,
				operator: "in"
			}
		],
		moduleId: categoryModuleId,
		limit: 100,
		skip: 0,
		order: "createdAt_DESC"
	});

	const pageStates = useMemo(() => {
		const categories = data || [];
		const pageStates: SiteState[] = [];

		if (categories.length > 0) {
			pageStates.push({
				value: "",
				label: "Alle"
			});
			categories.forEach((category: CategoryClass) => {
				pageStates.push({
					value: category.objectId,
					label: category.title || category.label
				});
			});
		}
		return pageStates;
	}, [data]);

	useEffect(() => {
		if (pageStates && !activePage) {
			setActivePage(pageStates[0]);
		}
	}, [pageStates, activePage]);

	useEffect(() => {
		const filterCopy = [...filters];

		const filterIndex = filterCopy.findIndex(
			(filter) => filter.key === "categories"
		);

		if (filterIndex !== -1) {
			filterCopy.splice(filterIndex, 1);
		}

		if (activePage?.value === "") {
			setFilters([...filterCopy]);
		} else if (activePage?.value) {
			setFilters([
				...filterCopy,
				{
					id: "categories",
					key: "categories",
					value: [activePage.value],
					operator: "in"
				}
			]);
		}
	}, [activePage]);

	return {
		pageStates,
		loading,
		activePage,
		setActivePage
	};
};
