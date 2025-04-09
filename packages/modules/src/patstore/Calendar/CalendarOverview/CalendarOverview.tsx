"use client";

import { useContext, useState, useMemo } from "react";
import {
	DataTransfer,
	generateQuery,
	Modal,
	Page,
	RenderFilters,
	Separator,
	Table,
	useCreateColumns
} from "@repo/ui";
import { PatstoreAppContext, useDataHandler } from "@repo/provider";
import { DateClass, Filter } from "@repo/types";
import createDate from "./constants/createCalendar";
import useFindDate from "./hooks/useFindDate";
// import createGroup from "./constants/createGroup";
// import group_states from "./constants/group_states";
import { formatISO } from "date-fns";

const CalendarOverview = () => {
	const { deleteData } = useDataHandler();
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
		data: [
			{ id: "image", type: "edit_image", label: "Bild" },
			{ id: "title", type: "edit_string", label: "Titel" },
			{ id: "date", type: "edit_date", label: "Daten" },
			{ id: "description", type: "edit_textfield", label: "Beschreibung" }
		],
		fields: currentModule.fields,
		className: "Calendar",
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
			createClass={createDate}
			refetch={refetch}
		>
			{process.env.NODE_ENV === "development" && (
				<DataTransfer<
					DateClass,
					{
						objectId: string;
						titel: string;
						beschreibung: string;
						info: string;
						datum: string;
						enddatum: string;
						ort: string;
					}
				>
					sourceClassName="Termin"
					targetClassName="Date"
					moduleId={currentModule.objectId}
					url="https://pg-app-mvx9tbt2yit00ef2pzlktzg3k81djj.scalabl.cloud/graphql/"
					masterKey="POcP3f5vEluCLVT1txftBPf5XGTIPYSki6UR7VRH"
					appId="E24kTRGCLBzXhUOQvwFNekgPpoMPeHRNITT67YiR"
					query={generateQuery({
						objectName: "Termin",
						fields: [
							"objectId",
							"titel",
							"beschreibung",
							"datum",
							"ort",
							"enddatum"
						]
					})}
					propertyMapping={(termin) => ({
						title: termin.titel,
						description: termin.beschreibung,
						date: {
							label: termin.titel,
							start: formatISO(termin.datum),
							end: termin.enddatum
								? formatISO(termin.enddatum)
								: "",
							place: {
								type: "address",
								address: termin.ort
							},
							full_day: false,
							id: termin.objectId
						}
					})}
				/>
			)}

			<Separator size="xs" noLine />
			<Table
				columns={columns}
				data={dates || []}
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
