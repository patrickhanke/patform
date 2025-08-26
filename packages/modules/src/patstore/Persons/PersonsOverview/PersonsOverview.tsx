"use client";

import { useContext, useMemo, useState } from "react";
import { Modal, Page, RenderFilters, Table, useCreateColumns } from "@repo/ui";
import { Filter, PersonClass } from "@repo/types";
import { PatstoreAppContext, useDataHandler } from "@repo/provider";
import useFindPerson from "./hooks/useFindPerson";
import create_person from "./constants/create_person";

const PersonsOverview = () => {
	const { deleteData } = useDataHandler(false);

	const { currentModule } = useContext(PatstoreAppContext);
	const [filters, setFilters] = useState<Filter[]>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});
	const [selectedRows, setSelectedRows] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const { persons, refetch, count } = useFindPerson({
		moduleId: currentModule.objectId,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize
	});

	const [deleteModal, setDeleteModal] = useState<boolean>(false);

	const columns = useCreateColumns<PersonClass>({
		data: [
			{ id: "portrait", type: "edit_image", label: "Portrait" },
			{
				id: "name",
				type: "edit_string",
				label: "Name",
				enableSorting: true,
				sortingFn(a, b) {
					return a.original.name.localeCompare(b.original.name);
				}
			},
			{
				id: "email",
				type: "edit_string",
				label: "E-Mail",
				enableSorting: true,
				sortingFn(a, b) {
					return a.original.name.localeCompare(b.original.name);
				}
			}
		],
		fields: currentModule.fields,
		className: "Person",
		refetch,
		categories: currentModule?.categories,
		
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
				text: "Personen löschen",
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
			// pageHeaderContent={<CreatePerson refetch={refetch} />}
			pageHeaderButtons={pageHeaderButtons}
			createClass={create_person}
			emptyContent={true}
			refetch={refetch}
		>
			<Table
				columns={columns}
				data={persons || []}
				rowCount={count}
				pagination={pagination}
				setPagination={setPagination}
				enableRowSelection
				selectedRows={selectedRows}
				setSelectedRows={setSelectedRows}
				filterContent={renderFilters}
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
								className: "Person",
								objectId
							});
						})
					);
					await refetch();
					setSelectedRows([]);
					setLoading(false);
					setDeleteModal(false);
				}}
				header={"Bilder löschen"}
			>
				<p>
					Sind sich Sicher, dass sie {selectedRows.length} Personen
					löschen möchten?
				</p>
			</Modal>
		</Page>
	);
};

export default PersonsOverview;
