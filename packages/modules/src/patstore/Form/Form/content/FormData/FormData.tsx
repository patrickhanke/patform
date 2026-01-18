import { Table } from "@repo/ui";
import useFormDataColumns from "./hooks/useFormDataColumns";
import { FC, useState, useMemo } from "react";
import { Filter } from "@repo/types";
import { FormDataProps } from "./types";
import generateFormData from "./functions/generateFormData";
import { useAppContext, useFindData } from "@repo/provider";
import { ExportButton } from "./content";
import keyTransformer from "./functions/keyTransformer";

const FormData: FC<FormDataProps> = ({
	formTitle,
	formId,
	selectedDataRows,
	setSelectedDataRows
}) => {
	const { project } = useAppContext();
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

	const formattedData = useMemo(
		() =>
			generateFormData(
				data.map((dataElement) => {
					return {
						...dataElement.data,
						createdAt: dataElement.createdAt,
						objectId: dataElement.objectId
					};
				})
			) || [],
		[data]
	);

	const selectedRowData = useMemo(() => {
		let data = null;
		let date = null;
		if (
			selectedDataRows &&
			Object.keys(selectedDataRows).length === 1 &&
			formattedData.length > 0
		) {
			const selectedIndex = Object.keys(selectedDataRows)[0];
			data = keyTransformer(formattedData[Number(selectedIndex)]) || null;
			date = formattedData[Number(selectedIndex)]?.createdAt || null;
		}
		return { data, date };
	}, [selectedDataRows, formattedData]);

	return (
		<div>
			{data.length === 0 ? (
				<p>Keine Daten vorhanden</p>
			) : (
				<div>
					<div
						style={{
							marginBottom: "16px",
							display: "flex",
							justifyContent: "flex-end"
						}}
					>
						<ExportButton
							title={`${project.name} - ${formTitle}`}
							date={selectedRowData?.date ?? ""}
							data={selectedRowData?.data}
							fileName="form-data-export"
							selectedRowsCount={
								selectedDataRows
									? Object.keys(selectedDataRows).length
									: 0
							}
						/>
					</div>
					<Table
						columns={columns}
						data={formattedData}
						setPagination={setPagination}
						pagination={pagination}
						rowCount={count}
						// filterContent={renderFilters}
						setSelectedRows={setSelectedDataRows}
						selectedRows={selectedDataRows}
						enableRowSelection
					/>
				</div>
			)}
		</div>
	);
};

export default FormData;
