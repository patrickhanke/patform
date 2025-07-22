import { Table } from "@repo/ui";
import useFormDataColumns from "./hooks/useFormDataColumns";
import useFindFormData from "./hooks/useFindFormData";
import { FC, useState } from "react";
import { Filter } from "@repo/types";
import { FormDataProps } from "./types";

const FormData: FC<FormDataProps> = ({ formId, setSelectedDataRows }) => {
	const initialFilters: Filter[] = [
		{
			key: "reference_id",
			operator: "_eq",
			id: "reference_id",
			value: formId
		}
	];
	const [filters] = useState<Filter[]>(initialFilters);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});

	const { data, refetch, count } = useFindFormData({
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize
	});

	const columns = useFormDataColumns({
		data,
		refetch
	});

	// const renderFilters = useMemo(() => {
	// 	return (
	// 		<RenderFilters
	// 			filters={filters}
	// 			setFilters={setFilters}
	// 			fields={[
	// 				{
	// 					type: "input",
	// 					key: "title",
	// 					operator: "_regex",
	// 					value: "",
	// 					placeholder: "Suchwort"
	// 				}
	// 			]}
	// 			categories={[]}
	// 			initialFilters={initialFilters}
	// 		/>
	// 	);
	// }, []);

	console.log(
		data.map((dataElement) => ({
			...dataElement.data,
			objectId: dataElement.objectId
		})) || []
	);

	return (
		<div>
			{data.length === 0 ? (
				<p>Keine Daten vorhanden</p>
			) : (
				<Table
					columns={columns}
					data={
						data.map((dataElement) => ({
							...dataElement.data,
							createdAt: dataElement.createdAt,
							objectId: dataElement.objectId
						})) || []
					}
					setPagination={setPagination}
					pagination={pagination}
					rowCount={count}
					// filterContent={renderFilters}
					onRowSelection={setSelectedDataRows}
					enableRowSelection
				/>
			)}
		</div>
	);
};

export default FormData;
