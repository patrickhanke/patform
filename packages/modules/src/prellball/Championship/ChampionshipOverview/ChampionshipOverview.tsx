"use client";

import { useState } from "react";
import {
	generateColumnsFromFields,
	Page,
	Table,
	useCreateColumns
} from "@repo/ui";
import {
	ChampionshipClass,
	Filter,
	LanguageValue,
	ModuleOverviewProps
} from "@repo/types";
import {
	filterModuleCategories,
	useFindCategoryPageStates,
	useFindModuleData
} from "@repo/provider";
import { championshipInitialData } from "./constants/create_fields";

const ChampionshipOverview = ({
	module,
	languages,
	defaultLanguage
}: ModuleOverviewProps<"/championships">) => {
	const [filters, setFilters] = useState<Filter[]>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});
	const { pageStates, setActivePage, activePage } = useFindCategoryPageStates(
		{
			categories:
				filterModuleCategories(module.categories || []).categoryIds ||
				[],
			categoryModuleId: filterModuleCategories(module.categories || [])
				.categoryModuleId,
			filters,
			setFilters
		}
	);
	const [order, setOrder] = useState<string>("createdAt_DESC");
	const [language, setLanguage] = useState<LanguageValue>(defaultLanguage);
	const {
		data,
		refetch,
		count,
		loading: dataLoading
	} = useFindModuleData<ChampionshipClass>({
		module,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize,
		order,
		fetchTranslations: Boolean(defaultLanguage) && languages.length > 1,
		additionalFields: ["title", "categories"]
	});

	const columns = useCreateColumns<ChampionshipClass>({
		className: "Championship",
		data: generateColumnsFromFields(module.fields),
		fields: module.data_fields,
		categories: module?.categories,
		refetch,
		languages,
		initialData: data ?? [],
		editLink: "championships"
	});

	return (
		<Page
			title={module.name}
			emptyContent
			createClass={{
				className: "Championship",
				text: "Neuen Wettkampf erstellen",
				fields: module.fields,
				refetch,
				languages,
				initialData: championshipInitialData,
				disabled: true
			}}
			pageStates={pageStates}
			setPageState={setActivePage}
			pageState={activePage}
			refetch={refetch}
		>
			<Table
				columns={columns}
				data={data || []}
				loading={dataLoading}
				rowCount={count}
				pagination={pagination}
				setPagination={setPagination}
				setOrder={setOrder}
				language={language}
				changeLanguage={setLanguage}
				languages={languages}
				filters={filters}
				setFilters={setFilters}
				filterColumns={module.filters || []}
			/>
		</Page>
	);
};

export default ChampionshipOverview;
