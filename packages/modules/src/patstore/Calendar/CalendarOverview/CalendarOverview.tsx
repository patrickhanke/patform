"use client";

import { useContext, useState, useMemo } from "react";
import {
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

const CalendarOverview = () => {
	const { deleteData } = useDataHandler();
	const { currentModule } = useContext(PatstoreAppContext);
	const [filters, setFilters] = useState<Filter[]>([]);
	const [loading, setLoading] = useState(false);

	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});
	const { groups, refetch, count } = useFindDate({
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
			{ id: "dates", type: "edit_dates", label: "Daten" },
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
			{/* {process.env.NODE_ENV === "development" && (
				<DataTransfer<
					GroupClass,
					{
						titel: string;
						beschreibung: string;
						info: string;
						startalter: string;
						endalter: string;
						aktiv: boolean;
						geschlecht: string;
						email: string;
						bild: object;
						mannschaft: {
							objectId: string;
							titel: string;
							portrait: string;
							text: string;
						};
					}
				>
					sourceClassName="Trainingsgruppe"
					targetClassName="Group"
					moduleId={currentModule.objectId}
					url="https://pg-app-mvx9tbt2yit00ef2pzlktzg3k81djj.scalabl.cloud/graphql/"
					masterKey="POcP3f5vEluCLVT1txftBPf5XGTIPYSki6UR7VRH"
					appId="E24kTRGCLBzXhUOQvwFNekgPpoMPeHRNITT67YiR"
					query={generateQuery({
						objectName: "Trainingsgruppe",
						fields: [
							"titel",
							"beschreibung",
							"info",
							"startalter",
							"endalter",
							"aktiv",
							"geschlecht",
							"email",
							"bild",
							"mannschaft {objectId titel portrait text}"
						]
					})}
					propertyMapping={(trainingsgruppe) => ({
						title: trainingsgruppe.titel,
						description: trainingsgruppe.beschreibung,
						info: trainingsgruppe.info,
						image: trainingsgruppe.bild as unknown as string,
						data: {
							start_age: trainingsgruppe.startalter,
							end_age: trainingsgruppe.endalter,
							info: trainingsgruppe.info,
							description: trainingsgruppe.beschreibung,
							contact: trainingsgruppe.email,

							gender: "female"
						},
						state:
							trainingsgruppe?.aktiv === false
								? "draft"
								: "published",
						team: {
							id: trainingsgruppe?.mannschaft?.objectId,
							name: trainingsgruppe?.mannschaft?.titel,
							image: trainingsgruppe?.mannschaft?.portrait,
							description: trainingsgruppe?.mannschaft?.text
						}
					})}
				/>
			)} */}

			<Separator size="xs" noLine />
			<Table
				columns={columns}
				data={groups || []}
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
				header={"Eintrag löschen"}
			>
				<p>Sind sich Sicher, dass sie die Einträge löschen möchten?</p>
			</Modal>
		</Page>
	);
};

export default CalendarOverview;
