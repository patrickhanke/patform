"use client";

import { useState } from "react";
import { Page, Table } from "@repo/ui";
import { Filter, ModuleOverviewProps } from "@repo/types";
import { useFindModuleData } from "@repo/provider";
import { CompetitionClass } from "@repo/types";
import {
	CompetitionCreateFields,
	CompetitionInitialData
} from "./constants/create_fields";
import { getCompetitionOverviewColumns } from "./constants/overview_columns";

const CompetitionOverview = ({
	module,
	languages,
	defaultLanguage
}: ModuleOverviewProps<"/competitions">) => {
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
	} = useFindModuleData<CompetitionClass>({
		module,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize,
		order,
		defaultLanguage,
		additionalFields: ["title", "season"]
	});

	const columns = getCompetitionOverviewColumns(refetch);

	return (
		<Page
			title={module.name}
			emptyContent={true}
			createClass={{
				className: "Competition",
				text: "Neue Meisterschaft erstellen",
				fields: CompetitionCreateFields,
				refetch,
				initialData: CompetitionInitialData
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

export default CompetitionOverview;
