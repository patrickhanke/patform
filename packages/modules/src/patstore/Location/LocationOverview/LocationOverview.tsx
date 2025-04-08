"use client";

import { useContext, useState, useMemo } from "react";
import { PatstoreAppContext, useDataHandler } from "@repo/provider";
import useFindLocation from "./hooks/useFindLocation";
import { Modal, Page, RenderFilters, Table, useCreateColumns } from "@repo/ui";
import { Filter, LocationClass } from "@repo/types";
import createLocation from "./constants/createLocation";

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

	const { locations, refetch, count } = useFindLocation({
		moduleId: currentModule.objectId,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize
	});

	const columns = useCreateColumns<LocationClass>({
		data: [
			{ id: "image", type: "edit_image", label: "Bild" },
			{ id: "name", type: "edit_string", label: "Name" },
			{ id: "address", type: "edit_textfield", label: "Adresse" },
			{
				id: "description",
				type: "edit_textfield",
				label: "Beschreibung"
			},
			{ id: "coordinates", type: "edit_geopoint", label: "Koordinaten" }
		],
		fields: currentModule.fields,
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
						key: "name",
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
			createClass={createLocation}
			refetch={refetch}
			pageHeaderButtons={pageHeaderButtons}
		>
			<Table
				columns={columns}
				data={locations || []}
				setPagination={setPagination}
				pagination={pagination}
				rowCount={count}
				filterContent={renderFilters}
				onRowSelection={setSelectedRows}
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
