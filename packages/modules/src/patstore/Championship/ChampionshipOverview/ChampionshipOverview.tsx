"use client";

import { useState } from "react";
import { Page, Table } from "@repo/ui";
import { Filter, ModuleOverviewProps } from "@repo/types";
import { useFindModuleData } from "@repo/provider";
import { ChampionshipClass } from "@repo/types";
import {
	championshipCreateFields,
	championshipInitialData
} from "./constants/create_fields";
import { getChampionshipOverviewColumns } from "./constants/overview_columns";

const ChampionshipOverview = ({
	module,
	languages,
	defaultLanguage
}: ModuleOverviewProps<"/championships">) => {
	const [filters] = useState<Filter[]>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});
	const [order, setOrder] = useState<string>("createdAt_DESC");
	const {
		data,
		refetch,
		count,
		loading: dataLoading,
		language,
		changeLanguage
	} = useFindModuleData<ChampionshipClass>({
		module,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize,
		order,
		defaultLanguage,
		additionalFields: ["title", "season"]
	});

	const columns = getChampionshipOverviewColumns(refetch);

	return (
		<Page
			title={module.name}
			emptyContent={true}
			createClass={{
				className: "Championship",
				text: "Neue Meisterschaft erstellen",
				fields: championshipCreateFields,
				refetch,
				initialData: championshipInitialData
			}}
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
				changeLanguage={changeLanguage}
				languages={languages}
			/>
		</Page>
	);
};

export default ChampionshipOverview;
