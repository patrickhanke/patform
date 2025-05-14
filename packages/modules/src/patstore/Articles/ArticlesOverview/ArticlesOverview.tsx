"use client";

import { useContext, useState, useMemo } from "react";
import { Modal, Page, RenderFilters, Table, useCreateColumns } from "@repo/ui";
import {
	PatstoreAppContext,
	generateGraphQLQuery,
	useDataHandler
} from "@repo/provider";
import useFindArticles from "./hooks/useFindArticles";
import { ArticleClass, Filter, PersonClass } from "@repo/types";
import createArticle from "./constants/createArticle";
import { useQuery } from "@apollo/client";
import state from "./constants/articleState";

const ArticlesOverview = () => {
	const { currentModule, modules } = useContext(PatstoreAppContext);
	const { deleteData } = useDataHandler();
	const [selectedRows, setSelectedRows] = useState<string[]>([]);
	const [filters, setFilters] = useState<Filter[]>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});
	const { articles, refetch, count } = useFindArticles({
		moduleId: currentModule.objectId,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize
	});

	const [deleteModal, setDeleteModal] = useState<boolean>(false);
	const [loading, setLoading] = useState(false);
	const { data: personData } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Person",
			fields: ["objectId", "label", "portrait"]
		}),
		{
			variables: {
				params: {
					module: {
						_eq: modules.find((module) => module.name === "Person")
							?.objectId
					}
				}
			}
		}
	);

	const columns = useCreateColumns<ArticleClass>({
		data: [
			{ id: "image", type: "edit_image", label: "Bild" },
			{ id: "date", type: "date_picker", label: "Datum" },
			{ id: "title", type: "edit_string", label: "Titel" },
			{ id: "text", type: "texteditor", label: "Text" },
			{ id: "state", type: "edit_state", label: "Status" },
			{ id: "gallery", type: "gallery", label: "Galerie" },
			{ id: "author", type: "edit_person", label: "Autor" }
		],
		fields: currentModule.fields,
		className: "Article",
		refetch,
		categories: currentModule?.categories,
		constants: { state }
	});

	const pageHeaderButtons = useMemo(
		() => [
			{
				text: "Berichte löschen",
				onClick: () => {
					setDeleteModal(true);
				},
				icon: "delete",
				disabled: selectedRows.length === 0
			}
		],
		[selectedRows]
	);

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

	return (
		<Page
			title={currentModule.name}
			emptyContent={true}
			pageHeaderButtons={pageHeaderButtons}
			createClass={createArticle(
				personData?.objects.findPerson.results.map(
					(person: PersonClass) => ({
						value: person.objectId,
						label: person.label
					})
				) || []
			)}
			refetch={refetch}
		>
			<Table
				columns={columns}
				data={articles || []}
				rowCount={count}
				pagination={pagination}
				setPagination={setPagination}
				enableRowSelection
				onRowSelection={setSelectedRows}
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
								className: "Article",
								objectId
							});
						})
					);
					await refetch();
					setSelectedRows([]);
					setLoading(false);
					setDeleteModal(false);
				}}
				header={"Berichte löschen"}
			>
				<p>
					Sind sich Sicher, dass sie {selectedRows.length} Berichte
					löschen möchten?
				</p>
			</Modal>
		</Page>
	);
};

export default ArticlesOverview;
