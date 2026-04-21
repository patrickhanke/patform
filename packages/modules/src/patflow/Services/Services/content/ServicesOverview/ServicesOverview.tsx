"use client";

import { useDataStore } from "@repo/provider";
import { FC, useMemo, useState } from "react";
import { Table } from "@repo/ui";
import useServiceSettingsTableColumns from "./hooks/useServiceSettingsTableColumns";
import { Filter } from "@repo/types";
import filter_columns from "./constants/filters";
import { serviceExportColumns } from "./constants/serviceExportColumns";
import { ServicesOverviewProps } from "./types";

const ServicesOverview: FC<ServicesOverviewProps> = ({ propertyId }) => {
	const { services, getServices } = useDataStore();

	console.log(services);
	const [filters, setFilters] = useState<Filter[]>([]);
	const [_, setOrder] = useState<string>("createdAt_DESC");
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 20
	});
	const [selectedRows, setSelectedRows] = useState<string[]>([]);

	console.log({ filters });
	const tableData = useMemo(() => {
		return getServices(
			filters,
			pagination.pageIndex * pagination.pageSize,
			pagination.pageSize,
			propertyId
		);
	}, [filters, pagination.pageIndex, pagination.pageSize, services]);

	console.log({ tableData });

	const columns = useServiceSettingsTableColumns();

	return (
		<div className="content_element no_padding">
			<Table
				filters={filters}
				setFilters={setFilters}
				filterColumns={filter_columns}
				columns={columns}
				data={tableData || []}
				pagination={pagination}
				setPagination={setPagination}
				rowCount={services.length}
				setOrder={setOrder}
				enableRowSelection
				selectedRows={selectedRows}
				setSelectedRows={setSelectedRows}
				exportColumns={serviceExportColumns}
			/>
		</div>
	);
};

export default ServicesOverview;
