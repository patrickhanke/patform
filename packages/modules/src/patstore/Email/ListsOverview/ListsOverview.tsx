"use client";

import { useState, useMemo, useContext } from "react";
import {
	PatstoreAppContext,
	useDataHandler,
	useFindData
} from "@repo/provider";
import { Modal, Page, Table, useCreateColumns } from "@repo/ui";
import { Filter } from "@repo/types";

interface ListData {
	objectId: string;
	title: string;
	createdAt: string;
	updatedAt: string;
	data?: {
		recipients?: Array<{
			email: string;
			name: string;
			key: string;
		}>;
	};
}

const ListsOverview = () => {
	const { deleteData } = useDataHandler();
	const { currentModule } = useContext(PatstoreAppContext);
	const [filters] = useState<Filter[]>([
		{
			key: "type",
			value: "list",
			operator: "equalTo",
			id: "type_filter"
		}
	]);
	const [loading, setLoading] = useState(false);

	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});

	const [deleteModal, setDeleteModal] = useState<boolean>(false);
	const [selectedRows, setSelectedRows] = useState<string[]>([]);
	const [order, setOrder] = useState<string>("createdAt_DESC");

	const { data, refetch, count } = useFindData({
		objectName: "Item",
		fields: ["objectId", "title", "createdAt", "updatedAt", "data"],
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize,
		order,
		moduleId: currentModule.objectId
	});

	const columns = useCreateColumns<ListData>({
		data: [
			{
				id: "title",
				label: "Titel",
				type: "string"
			},
			{
				id: "createdAt",
				label: "Erstellt am",
				type: "date"
			},
			{
				id: "updatedAt",
				label: "Zuletzt aktualisiert",
				type: "date"
			}
		],
		categories: [],
		className: "Item",
		refetch,
		editLink: "emails/lists"
	});

	const pageHeaderButtons = useMemo(
		() => [
			{
				text: "Listen löschen",
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
			title="E-Mail Listen"
			emptyContent={true}
			createClass={{
				initialData: {
					reference_id: currentModule.objectId,
					type: "list",
					settings: {
						unsubscribe: false,
						unsubscribe_link: ""
					}
				},
				className: "Item",
				text: "Neue Liste erstellen",
				fields: [
					{
						id: "title",
						label: "Titel",
						type: "string",
						required: true,
						active: true,
						default: true
					}
				],
				refetch,
				additionalData: { type: "list" }
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
				setOrder={setOrder}
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
								className: "Item",
								objectId
							});
						})
					);
					await refetch();
					setLoading(false);
					setDeleteModal(false);
					setSelectedRows([]);
				}}
				header={"Listen löschen"}
			>
				<p>
					Sind sich Sicher, dass sie die ausgewählten Listen löschen
					möchten?
				</p>
			</Modal>
		</Page>
	);
};

export default ListsOverview;
