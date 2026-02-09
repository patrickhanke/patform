import {
	ElementSelectInterface,
	IconButton,
	Modal,
	SlideIn,
	StateDisplay,
	StatelessToggle
} from "@repo/ui";
import { EditContentFieldProps } from "./types";
import { useState, FC, ReactNode, useEffect, useContext, useMemo } from "react";
import EditContent from "./components/EditContent";
import { Filter, WebpageContent } from "@repo/types";
import { cloneDeep, set } from "lodash-es";
import {
	PatstoreAppContext,
	useDataHandler,
	useFindData
} from "@repo/provider";
import content_type_options from "./constants/content_type_options";

const EditContentField: FC<EditContentFieldProps> = ({
	initialField,
	content,
	pageId,
	refetch,
	removeContentHandler
}) => {
	const { updateData } = useDataHandler();
	const [editContent, setEditContent] = useState(false);
	const [field, setField] = useState<WebpageContent>(initialField);
	const { currentModule } = useContext(PatstoreAppContext);
	const [pagination] = useState({
		pageIndex: 0,
		pageSize: 50
	});

	const [deleteModal, setDeleteModal] = useState(false);
	const [loading, setLoading] = useState(false);

	const [secondaryContent, setSecondaryContent] = useState<ReactNode | null>(
		null
	);

	const [filters] = useState<Filter[]>([
		{
			key: "type",
			operator: "in",
			value: ["table"]
		}
	]);

	const { data: webpageContent } = useFindData({
		objectName: "Content",
		fields: [
			"objectId",
			"title",
			"content_id",
			"type",
			"createdAt",
			"active",
			"content",
			"created_by {objectId username}",
			"updated_by {objectId username}",
			"categories"
		],
		moduleId: currentModule.objectId,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize
	});

	const selectElements = useMemo(() => {
		if (!webpageContent) {
			return [];
		}
		return webpageContent.map((element) => ({
			value: element.objectId,
			label: element.title
		}));
	}, [webpageContent]);

	useEffect(() => {
		if (field.type === "table") {
			setSecondaryContent(
				<ElementSelectInterface
					title="Tabelle auswählen"
					elements={selectElements}
					selectedElements={
						selectElements.filter(
							(element) => element.value === field.value
						) || []
					}
					onSelect={(value) => {
						if (value.length > 1) {
							return;
						} else if (value.length === 1 && value[0]) {
							setField({
								...field,
								value: value[0].id as string
							});
						} else {
							setField({ ...field, value: "" });
						}
					}}
				/>
			);
		} else {
			setSecondaryContent(null);
		}
	}, [field, selectElements, webpageContent]);

	return (
		<div className="flex row a-ce j-sb gap-sm w-100">
			<h3>{field.name}</h3>
			<div className="button_container">
				<StateDisplay
					color="yellow"
					label={
						content_type_options.find(
							(option) => option.value === field.type
						)?.label || ""
					}
				/>
				<p>|</p>
				<p>Aktiv: </p>
				<StatelessToggle
					value={field.active}
					onChange={async (value) => {
						const contentCopy: WebpageContent[] =
							cloneDeep(content);
						const fieldIndex = contentCopy.findIndex(
							(item: WebpageContent) => item.id === field.id
						);
						set(contentCopy, `${fieldIndex}.active`, value);

						await updateData({
							className: "Webpage",
							objectId: pageId,
							updateObject: {
								content: contentCopy
							},
							feedback: "Inhalte erfolgreich aktualisiert"
						});
						await refetch();
					}}
				/>
				<p>|</p>
				<IconButton icon="edit" onClick={() => setEditContent(true)} />
				<IconButton
					icon="delete"
					onClick={() => setDeleteModal(true)}
				/>
			</div>
			<SlideIn
				cancel={() => setEditContent(false)}
				confirm={async () => {
					const contentCopy: WebpageContent[] = cloneDeep(content);
					const fieldIndex = contentCopy.findIndex(
						(item: WebpageContent) => item.id === field.id
					);

					if (fieldIndex === -1) {
						contentCopy.push({
							...field,
							position: contentCopy.length
						});
					} else {
						set(contentCopy, `${fieldIndex}`, field);
					}

					await updateData({
						className: "Webpage",
						objectId: pageId,
						updateObject: {
							content: contentCopy
						},
						feedback: "Inhalte erfolgreich aktualisiert"
					});
					await refetch();
					setEditContent(false);
				}}
				isOpen={editContent}
				header="Inhalte bearbeiten"
				secondaryContent={secondaryContent}
				showSecondaryContent
			>
				<EditContent content={field} setContent={setField} />
			</SlideIn>
			<Modal
				header="Element löschen"
				isOpen={deleteModal}
				cancelButtonHandler={() => setDeleteModal(false)}
				buttonDisabled={[loading, loading]}
				confirmButtonHandler={async () => {
					setLoading(true);
					await removeContentHandler(field.id);
					setLoading(false);
					setDeleteModal(false);
				}}
			>
				Sind Sie sicher, dass Sie das Element &quot;{field.name}&quot;
				löschen möchten?
			</Modal>
		</div>
	);
};

export default EditContentField;
