"use client";

import { useState } from "react";
import { Page, Table } from "@repo/ui";
import { ClubClass, Filter, ModuleOverviewProps } from "@repo/types";
import { useFindModuleData } from "@repo/provider";
import { clubCreateFields, clubInitialData } from "./constants/create_fields";
import { getClubOverviewColumns } from "./constants/overview_columns";

const ClubOverview = ({
	module,
	languages,
	defaultLanguage
}: ModuleOverviewProps<"/clubs">) => {
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
	} = useFindModuleData<ClubClass>({
		module,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize,
		order,
		defaultLanguage,
		additionalFields: ["title", "short"]
	});

	const columns = getClubOverviewColumns(refetch);

	return (
		<Page
			title={module.name}
			emptyContent={true}
			createClass={{
				className: "Club",
				text: "Neuen Verein erstellen",
				fields: clubCreateFields,
				refetch,
				initialData: clubInitialData
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

export default ClubOverview;
