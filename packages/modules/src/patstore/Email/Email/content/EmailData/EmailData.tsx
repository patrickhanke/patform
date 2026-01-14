import { Table } from "@repo/ui";
import useFormDataColumns from "./hooks/useFormDataColumns";
import { FC, useState } from "react";
import { Filter } from "@repo/types";
import { FormDataProps } from "./types";
import generateFormData from "./functions/generateFormData";
import { useFindData } from "@repo/provider";

const FormData: FC<FormDataProps> = ({
	formId,
	selectedDataRows,
	setSelectedDataRows
}) => {
	const initialFilters: Filter[] = [
		{
			key: "reference_id",
			operator: "equalTo",
			id: "reference_id",
			value: formId
		}
	];
	const [filters] = useState<Filter[]>(initialFilters);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});

	const { data, refetch, count } = useFindData({
		objectName: "Item",
		fields: ["objectId", "createdAt", "data"],
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize
	});

	const columns = useFormDataColumns({
		data,
		refetch
	});

	return (
		<div>
			{data.length === 0 ? (
				<p>Keine Daten vorhanden</p>
			) : (
				<Table
					columns={columns}
					data={
						generateFormData(
							data.map((dataElement) => {
								return {
									...dataElement.data,
									createdAt: dataElement.createdAt,
									objectId: dataElement.objectId
								};
							})
						) || []
					}
					setPagination={setPagination}
					pagination={pagination}
					rowCount={count}
					// filterContent={renderFilters}
					setSelectedRows={setSelectedDataRows}
					selectedRows={selectedDataRows}
					enableRowSelection
				/>
			)}
		</div>
	);
};

export default FormData;
