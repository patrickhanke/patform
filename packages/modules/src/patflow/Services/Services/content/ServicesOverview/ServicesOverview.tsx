import { useDataStore } from "@repo/provider";
import { FC, useMemo, useState } from "react";
import { UpdateHandler } from "./types";
import { Table } from "@repo/ui";
import useServiceSettingsTableColumns from "./hooks/useServiceSettingsTableColumns";
import { useDataHandler } from "@repo/provider";
import { Filter } from "@repo/types";
import filter_columns from "./constants/filters";
import { serviceExportColumns } from "./constants/serviceExportColumns";

const ServiceSettings: FC = () => {
	const { services, getServices } = useDataStore();

	console.log(services);
	const { updateData } = useDataHandler();
	const [filters, setFilters] = useState<Filter[]>([]);
	const [setOrder] = useState<string>("createdAt_DESC");
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 20
	});
	const [selectedRows, setSelectedRows] = useState<string[]>([]);

	const tableData = useMemo(() => {
		return getServices(
			filters,
			pagination.pageIndex * pagination.pageSize,
			pagination.pageSize
		);
	}, [filters, pagination.pageIndex, pagination.pageSize, services]);

	console.log({ tableData });

	const updateHandler: UpdateHandler = async ({
		serviceId,
		updateObject
	}) => {
		await updateData({
			className: "Service",
			objectId: serviceId,
			updateObject
		});
	};
	const columns = useServiceSettingsTableColumns({ updateHandler });

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

export default ServiceSettings;
