"use client";

import { useAppContext, useFindData } from "@repo/provider";
import { Page, Table } from "@repo/ui";
import { useMemo, useState } from "react";
import { Filter } from "@repo/types";
import { useLogFilters, useLogColumns } from "./hooks";
import query_fields from "./constants/query_fields";

const LogOverview = () => {
	const { project } = useAppContext();
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});
	const [filters, setFilters] = useState<Filter[]>([]);

	const { data, count, refetch } = useFindData({
		objectName: "Log",
		fields: query_fields,
		filters,
		projectId: project?.objectId
	});

	const siteHeaderButtons = useMemo(() => {
		return [
			{
				text: "Neu laden",
				onClick: () => {
					refetch();
				}
			}
		];
	}, []);

	const { filters: filterColumns } = useLogFilters();

	const columns = useLogColumns();

	return (
		<Page title="Logs" pageHeaderButtons={siteHeaderButtons}>
			<Table
				columns={columns}
				data={data}
				pagination={pagination}
				setPagination={setPagination}
				rowCount={count}
				filters={filters}
				setFilters={setFilters}
				filterColumns={filterColumns}
			/>
		</Page>
	);
};

export default LogOverview;
