import { Modal, Table, useCreateColumns } from "@repo/ui";
import { FC, useState, useMemo } from "react";
import { Filter, FormDataClass } from "@repo/types";
import { FormDataProps } from "./types";
import generateFormData from "./functions/generateFormData";
import { useAppContext, useDataHandler, useFindData } from "@repo/provider";
import { ExportButton } from "./content";
import keyTransformer from "./functions/keyTransformer";
import { isArray } from "lodash-es";
import geneateFormColumns from "./functions/generateFormColumns";

const FormData: FC<FormDataProps> = ({
	formTitle,
	formId,
	selectedDataRows,
	setSelectedDataRows,
	dataDeleteModal,
	setDataDeleteModal,
	loading,
	setLoading
}) => {
	const { deleteData } = useDataHandler();
	const { project } = useAppContext();
	const initialFilters: Filter[] = [
		{
			key: "reference_id",
			operator: "equalTo",
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

	const columns = useCreateColumns<FormDataClass["data"]>({
		data: [
			{ id: "createdAt", type: "date", label: "Datum" },
			...geneateFormColumns(
				isArray(data) ? data.map((data) => data.data) : []
			)
		],
		fields: [],
		className: "Item",
		refetch,
		categories: []
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
			<Modal
				isOpen={dataDeleteModal}
				cancelButtonHandler={() => setDataDeleteModal(false)}
				buttonDisabled={[loading, loading]}
				confirmButtonHandler={async () => {
					setLoading(true);
					await Promise.all(
						selectedDataRows.map(async (objectId) => {
							await deleteData({
								className: "Item",
								objectId
							});
						})
					);
					await refetch();
					setSelectedDataRows([]);
					setLoading(false);
					setDataDeleteModal(false);
				}}
				header={"Datensätze löschen"}
			>
				<p>
					Sind sich Sicher, dass sie die Datensätze löschen möchten?
				</p>
			</Modal>
		</div>
	);
};

export default FormData;
