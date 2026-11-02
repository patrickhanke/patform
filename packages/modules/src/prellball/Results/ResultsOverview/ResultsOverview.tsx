"use client";

import { useState } from "react";
import { Page, Table } from "@repo/ui";
import {
	ChampionshipClass,
	Filter,
	LanguageValue,
	ModuleOverviewProps
} from "@repo/types";
import { useAppContext, useFindModuleData } from "@repo/provider";
import useSeasonCategories from "../../hooks/useSeasonCategories";
import {
	championshipCreateFields,
	championshipInitialData
} from "../../Championship/ChampionshipOverview/constants/create_fields";
import { getResultsOverviewColumns } from "./constants/overview_columns";

const ResultsOverview = ({
	module,
	languages,
	defaultLanguage
}: ModuleOverviewProps<"/championships">) => {
	const { project } = useAppContext();
	const seasons = useSeasonCategories(project?.objectId);
	const [filters] = useState<Filter[]>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});
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

	return (
		<Page
			title={module.name}
			emptyContent
			createClass={{
				className: "Championship",
				text: "Neuen Wettkampf erstellen",
				fields: championshipCreateFields,
				refetch,
				languages,
				initialData: championshipInitialData
			}}
			refetch={refetch}
		>
			<Table
				columns={getResultsOverviewColumns(refetch, language, seasons)}
				data={data || []}
				loading={dataLoading}
				rowCount={count}
				pagination={pagination}
				setPagination={setPagination}
				setOrder={setOrder}
				language={language}
				changeLanguage={setLanguage}
				languages={languages}
			/>
		</Page>
	);
};

export default ResultsOverview;
