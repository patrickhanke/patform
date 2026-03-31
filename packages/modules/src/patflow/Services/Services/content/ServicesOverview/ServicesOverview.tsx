import { useFindData } from "@repo/provider";
import { FC, useState } from "react";
import { ServiceSettingsProps, UpdateHandler } from "./types";
import { Table } from "@repo/ui";
import useServiceSettingsTableColumns from "./hooks/useServiceSettingsTableColumns";
import { useDataHandler } from "@repo/provider";
import CreateService from "./components/CreateService";
import { Filter } from "@repo/types";
import filter_columns from "./constants/filters";
import { serviceExportColumns } from "./constants/serviceExportColumns";

const ServiceSettings: FC<ServiceSettingsProps> = ({
	projectId,
	createService,
	setCreateService
}) => {
	const { updateData } = useDataHandler();
	const [filters, setFilters] = useState<Filter[]>([]);
	const [order, setOrder] = useState<string>("createdAt_DESC");
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 20
	});
	const [selectedRows, setSelectedRows] = useState<string[]>([]);

	const { data, refetch, count } = useFindData({
		objectName: "Service",
		fields: [
			"objectId",
			"name",
			"is_active",
			"description",
			"createdAt",
			"properties"
		],
		filters,
		projectId,
		skip: pagination.pageIndex * pagination.pageSize,
		limit: pagination.pageSize,
		order
	});

	const updateHandler: UpdateHandler = async ({
		serviceId,
		updateObject
	}) => {
		await updateData({
			className: "Service",
			objectId: serviceId,
			updateObject
		});
		refetch();
	};
	const columns = useServiceSettingsTableColumns({ updateHandler });

	return (
		<div className="content_element no_padding">
			<Table
				filters={filters}
				setFilters={setFilters}
				filterColumns={filter_columns}
				columns={columns}
				data={data || []}
				pagination={pagination}
				setPagination={setPagination}
				rowCount={count}
				setOrder={setOrder}
				enableRowSelection
				selectedRows={selectedRows}
				setSelectedRows={setSelectedRows}
				exportColumns={serviceExportColumns}
			/>
			<CreateService
				createService={createService}
				setCreateService={setCreateService}
				refetch={refetch}
			/>
		</div>
	);
};

export default ServiceSettings;
