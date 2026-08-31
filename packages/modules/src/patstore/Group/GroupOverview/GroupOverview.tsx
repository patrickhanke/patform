"use client";

import { useState, useMemo } from "react";
import {
	generateColumnsFromFields,
	Modal,
	Page,
	Separator,
	Table,
	useCreateColumns,
	usePageData
} from "@repo/ui";
import {
	useDataHandler,
	useFindCategoryPageStates,
	useFindModuleData,
	filterModuleCategories
} from "@repo/provider";
import { Filter, GroupClass, ModuleOverviewProps } from "@repo/types";

const GroupOverview = ({
	module,
	languages,
	defaultLanguage
}: ModuleOverviewProps<"/groups">) => {
	const { deleteData } = useDataHandler();
	const [filters, setFilters] = useState<Filter[]>([]);
	const { pageStates, setActivePage, activePage } = useFindCategoryPageStates(
		{
			categories:
				filterModuleCategories(module.categories).categoryIds || [],
			categoryModuleId: filterModuleCategories(module.categories)
				.categoryModuleId,
			filters,
			setFilters
		}
	);
	const [loading, setLoading] = useState(false);

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
	} = useFindModuleData<GroupClass>({
		module,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize,
		order,
		defaultLanguage
	});

	const columns = useCreateColumns<GroupClass>({
		data: generateColumnsFromFields(module.fields),
		fields: module.data_fields,
		className: "Group",
		refetch,
		categories: module.categories,
		initialData: data ?? []
	});
	const { data: pageRows } = usePageData<GroupClass[]>();

	const pageHeaderButtons = useMemo(
		() => [
			{
				text: "Gruppen löschen",
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
				className: "Group",
				text: "Neue Gruppe erstellen",
				fields: module.fields,
				refetch: refetch,
				languages: languages,
				initialState: "draft"
			}}
			refetch={refetch}
			pageStates={pageStates}
			setPageState={setActivePage}
			pageState={activePage}
		>
			<Separator size="xs" noLine />
			<Table
				columns={columns}
				data={pageRows ?? data ?? []}
				loading={dataLoading}
				setPagination={setPagination}
				pagination={pagination}
				rowCount={count}
				filters={filters}
				setFilters={setFilters}
				filterColumns={module.filters}
				selectedRows={selectedRows}
				setSelectedRows={setSelectedRows}
				setOrder={setOrder}
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
								className: "Group",
								objectId
							});
						})
					);
					await refetch();
					setLoading(false);
					setDeleteModal(false);
				}}
				header={"Gruppe löschen"}
			>
				<p>Sind sich Sicher, dass sie die Gruppen löschen möchten?</p>
			</Modal>
		</Page>
	);
};

export default GroupOverview;
