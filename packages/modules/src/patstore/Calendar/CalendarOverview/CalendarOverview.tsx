"use client";

import { useState, useMemo } from "react";
import {
	generateColumnsFromFields,
	Modal,
	Page,
	RenderFilters,
	Separator,
	Table,
	useCreateColumns
} from "@repo/ui";
import { useDataHandler, useFindModuleData } from "@repo/provider";
import { AppointmentClass, Filter, Module } from "@repo/types";

const CalendarOverview = ({ module }: { module: Module }) => {
	const { deleteData } = useDataHandler();
	const [filters, setFilters] = useState<Filter[]>([]);
	const [loading, setLoading] = useState(false);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});
	const [order, setOrder] = useState<string>("createdAt_DESC");

	const {
		data,
		refetch,
		count,
		loading: dataLoading
	} = useFindModuleData<AppointmentClass>({
		module,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize,
		order,
		additionalFields: ["date"]
	});

	const [deleteModal, setDeleteModal] = useState<boolean>(false);
	const [selectedRows, setSelectedRows] = useState<string[]>([]);

	const columns = useCreateColumns<AppointmentClass>({
		data: [
			{
				id: "date",
				type: "edit_date",
				label: "Datum"
			},
			...generateColumnsFromFields(module.fields)
		],
		fields: module.data_fields,
		className: "Appointment",
		refetch,
		categories: module?.categories,
		constants: {}
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
				text: "Eintrag löschen",
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
			pageHeaderButtons={pageHeaderButtons}
			createClass={{
				className: "Appointment",
				text: "Neuen Kalendereintrag erstellen",
				fields: module.fields,
				refetch: refetch
			}}
			refetch={refetch}
		>
			<Separator size="xs" noLine />
			<Table
				columns={columns}
				data={data || []}
				loading={dataLoading}
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
								className: "Appointment",
								objectId
							});
						})
					);
					await refetch();
					setLoading(false);
					setDeleteModal(false);
				}}
				header={"Eintrag löschen"}
			>
				<p>Sind sich Sicher, dass sie die Einträge löschen möchten?</p>
			</Modal>
		</Page>
	);
};

export default CalendarOverview;
