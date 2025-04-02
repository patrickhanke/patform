"use client";

import { useContext, useState } from "react";
import {
	DataTransfer,
	generateQuery,
	Modal,
	Page,
	Table,
	useCreateColumns
} from "@repo/ui";
import {
	PatstoreAppContext,
	generateGraphQLQuery,
	getDateString
} from "@repo/provider";
import deleteModalInitialValues from "./constants/deleteModalInitialValues";
import useFindArticles from "./hooks/useFindArticles";
import { ArticleClass, PersonClass } from "@repo/types";
import createArticle from "./constants/createArticle";
import { useQuery } from "@apollo/client";
import state from "./constants/articleState";

const ArticlesOverview = () => {
	const { currentModule, modules } = useContext(PatstoreAppContext);
	const [filters] = useState([]);
	const { articles, refetch } = useFindArticles({
		moduleId: currentModule.objectId,
		filters
	});
	const [deleteModal, setDeleteModal] = useState(deleteModalInitialValues);
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

	return (
		<Page
			title={currentModule.name}
			emptyContent={true}
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
			{process.env.NODE_ENV === "development" && (
				<DataTransfer<
					Omit<ArticleClass, "objectId" | "author" | "createdAt">
				>
					sourceClassName="Berichte"
					targetClassName="Article"
					moduleId={currentModule.objectId}
					url="https://pg-app-mvx9tbt2yit00ef2pzlktzg3k81djj.scalabl.cloud/graphql/"
					masterKey="POcP3f5vEluCLVT1txftBPf5XGTIPYSki6UR7VRH"
					appId="E24kTRGCLBzXhUOQvwFNekgPpoMPeHRNITT67YiR"
					query={generateQuery({
						objectName: "Berichte",
						fields: [
							"titel",
							"html",
							"titelbild",
							"datum",
							"veroeffentlicht"
						]
					})}
					propertyMapping={(data) => ({
						text: data.html as string,
						title: data.titel as string,
						state:
							data.veroeffentlich === true
								? "published"
								: "draft",
						image: data.titelbild as string,
						gallery: [],
						categories: [],
						date: getDateString(data.datum as string).date,
						author: undefined,
						module: {
							__type: "Pointer",
							className: "Module",
							objectId: currentModule.objectId
						},
						label: data.titel as string,
						data: undefined
					})}
				/>
			)}
			<Table columns={columns} data={articles || []} />
			<Modal
				isOpen={deleteModal.isOpen}
				cancelButtonHandler={() =>
					setDeleteModal(deleteModalInitialValues)
				}
				confirmButtonHandler={() => {
					deleteModal.confirmButtonHandler();
					setDeleteModal(deleteModalInitialValues);
				}}
				header={deleteModal.header}
			>
				<p>Sind sich Sicher, dass sie den Bericht löschen möchten?</p>
			</Modal>
		</Page>
	);
};

export default ArticlesOverview;
