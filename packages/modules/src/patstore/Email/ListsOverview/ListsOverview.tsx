"use client";

import { useState, useMemo } from "react";
import { useDataHandler, useFindData } from "@repo/provider";
import { Modal, Page, Table, useCreateColumns, usePageData } from "@repo/ui";
import { EmailList, Filter, ModuleOverviewProps } from "@repo/types";

const ListsOverview = ({
	module,
	languages,
	defaultLanguage
}: ModuleOverviewProps<"/emails">) => {
	const { deleteData } = useDataHandler();
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

	const { data, refetch, count, language, changeLanguage } = useFindData({
		objectName: "Email",
		fields: ["objectId", "title", "createdAt", "updatedAt", "data"],
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize,
		order,
		moduleId: module.objectId,
		defaultLanguage
	});

	const columns = useCreateColumns<EmailList>({
		data: [
			{
				id: "title",
				label: "Titel",
				type: "string"
			},
			{
				id: "objectId",
				label: "ID",
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
		className: "Email",
		refetch,
		editLink: "emails/lists",
		initialData: data ?? []
	});
	const { data: pageRows } = usePageData<EmailList[]>();

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
					type: "list",
					settings: {
						unsubscribe: false,
						unsubscribe_link: "",
						static_list: false,
						include_all_users: false,
						filters: []
					},
					data: {
						recipients: []
					},
					filters: []
				},
				className: "Email",
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
				refetch
			}}
			refetch={refetch}
			pageHeaderButtons={pageHeaderButtons}
		>
			<Table
				columns={columns}
				data={pageRows ?? data ?? []}
				setPagination={setPagination}
				pagination={pagination}
				rowCount={count}
				setOrder={setOrder}
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
