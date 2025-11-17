"use client";

import { useContext, useState, useMemo } from "react";
import {
	PatstoreAppContext,
	useDataHandler,
	useFindModuleData
} from "@repo/provider";
import {
	generateColumnsFromFields,
	Modal,
	Page,
	RenderFilters,
	Table,
	useCreateColumns
} from "@repo/ui";
import { Filter, LocationClass } from "@repo/types";

const LocationOverview = () => {
	const { currentModule } = useContext(PatstoreAppContext);
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
	const { data, refetch, count } = useFindModuleData<LocationClass>({
		module: currentModule,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize,
		order
	});

	const columns = useCreateColumns<LocationClass>({
		data: generateColumnsFromFields(currentModule.fields),
		fields: currentModule.data_fields,
		className: "Location",
		refetch,
		categories: currentModule?.categories
	});

	const renderFilters = useMemo(() => {
		return (
			<RenderFilters
				filters={filters}
				setFilters={setFilters}
				fields={[
					{
						type: "input",
						key: "title",
						operator: "_regex",
						value: "",
						placeholder: "Suchwort"
					}
				]}
				categories={[]}
				initialFilters={[]}
			/>
		);
	}, []);

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
			title={currentModule.name}
			emptyContent={true}
			createClass={{
				className: "Location",
				text: "Neuen Ort erstellen",
				fields: currentModule.fields,
				refetch: refetch
			}}
			refetch={refetch}
			pageHeaderButtons={pageHeaderButtons}
		>
			<Table
				columns={columns}
				data={data || []}
				setPagination={setPagination}
				pagination={pagination}
				rowCount={count}
				filterContent={renderFilters}
				selectedRows={selectedRows}
				setSelectedRows={setSelectedRows}
				setOrder={setOrder}
				enableRowSelection
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
								className: "Group",
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
