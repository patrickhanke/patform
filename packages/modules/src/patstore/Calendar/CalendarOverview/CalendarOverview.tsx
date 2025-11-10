"use client";

import { useContext, useState, useMemo } from "react";
import {
	generateColumnsFromFields,
	Modal,
	Page,
	RenderFilters,
	Separator,
	Table,
	useCreateColumns
} from "@repo/ui";
import { PatstoreAppContext, useDataHandler } from "@repo/provider";
import { DateClass, Filter } from "@repo/types";
import useFindDate from "./hooks/useFindDate";

const CalendarOverview = () => {
	const { deleteData, updateData } = useDataHandler();
	const { currentModule } = useContext(PatstoreAppContext);
	const [filters, setFilters] = useState<Filter[]>([]);
	const [loading, setLoading] = useState(false);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});
	const { dates, refetch, count } = useFindDate({
		moduleId: currentModule.objectId,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize
	});

	const [deleteModal, setDeleteModal] = useState<boolean>(false);
	const [selectedRows, setSelectedRows] = useState<string[]>([]);

	const columns = useCreateColumns<DateClass>({
		data: generateColumnsFromFields(currentModule.fields),
		fields: currentModule.data_fields,
		className: "Date",
		refetch,
		categories: currentModule?.categories,
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
			title={currentModule.name}
			emptyContent={true}
			pageHeaderButtons={pageHeaderButtons}
			createClass={{
				className: "Date",
				text: "Neuen Kalendereintrag erstellen",
				fields: currentModule.fields,
				refetch: refetch
			}}
			refetch={refetch}
		>
			{process.env.NODE_ENV === "development" && (
				<>
					<button
						onClick={async () => {
							await Promise.all(
								dates.map(async (date) => {
									await updateData({
										className: "Date",
										objectId: date.objectId,
										updateObject: {
											title: date.title
										}
									});
								})
							);
						}}
					>
						Daten aktualisieren
					</button>
				</>
			)}
			<Separator size="xs" noLine />
			<Table
				columns={columns}
				data={dates || []}
				setPagination={setPagination}
				pagination={pagination}
				rowCount={count}
				filterContent={renderFilters}
				setSelectedRows={setSelectedRows}
				selectedRows={selectedRows}
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
								className: "Date",
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
