"use client";

import { useState, useMemo } from "react";
import { useDataHandler, useFindModuleData } from "@repo/provider";
import {
	generateColumnsFromFields,
	Modal,
	Page,
	Table,
	useCreateColumns,
	usePageData
} from "@repo/ui";
import { Filter, LocationClass, ModuleOverviewProps } from "@repo/types";

const LocationOverview = ({
	module,
	languages,
	defaultLanguage
}: ModuleOverviewProps<"/locations">) => {
	const [filters, setFilters] = useState<Filter[]>([]);
	const [loading, setLoading] = useState(false);
	const { deleteData } = useDataHandler();

	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});

	const [deleteModal, setDeleteModal] = useState<boolean>(false);
	const [selectedRows, setSelectedRows] = useState<string[]>([]);
	const [order, setOrder] = useState<string>("createdAt_DESC");
	const {
		data,
		refetch,
		count,
		loading: dataLoading,
		language,
		changeLanguage
	} = useFindModuleData<LocationClass>({
		module,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize,
		order,
		defaultLanguage
	});

	const columns = useCreateColumns<LocationClass>({
		data: generateColumnsFromFields(module.fields),
		fields: module.data_fields,
		className: "Location",
		refetch,
		categories: module.categories,
		initialData: data ?? []
	});
	const { data: pageRows } = usePageData<LocationClass[]>();

	const pageHeaderButtons = useMemo(
		() => [
			{
				text: "Orte löschen",
				onClick: () => {
					setDeleteModal(true);
				},
				icon: "delete",
				disabled: selectedRows.length === 0
			}
		],
		[selectedRows]
	);

	return (
		<Page
			title={module.name}
			emptyContent={true}
			createClass={{
				className: "Location",
				text: "Neuen Ort erstellen",
				fields: module.fields,
				refetch: refetch,
				languages: languages,
				initialState: "draft"
			}}
			refetch={refetch}
			pageHeaderButtons={pageHeaderButtons}
		>
			<Table
				columns={columns}
				data={pageRows ?? data ?? []}
				loading={dataLoading}
				setPagination={setPagination}
				pagination={pagination}
				rowCount={count}
				selectedRows={selectedRows}
				setSelectedRows={setSelectedRows}
				setOrder={setOrder}
				filters={filters}
				setFilters={setFilters}
				filterColumns={module.filters}
				enableRowSelection
				language={language}
				changeLanguage={changeLanguage}
				languages={languages}
			/>
			<Modal
				isOpen={deleteModal}
				cancelButtonHandler={() => setDeleteModal(false)}
				buttonDisabled={[loading, loading]}
				confirmButtonHandler={async () => {
					setLoading(true);
					await Promise.all(
						selectedRows.map(async (objectId) => {
							await deleteData({
								className: "Location",
								objectId
							});
						})
					);
					await refetch();
					setLoading(false);
					setDeleteModal(false);
				}}
				header={"Ort löschen"}
			>
				<p>Sind sich Sicher, dass sie die Orten löschen möchten?</p>
			</Modal>
		</Page>
	);
};

export default LocationOverview;
