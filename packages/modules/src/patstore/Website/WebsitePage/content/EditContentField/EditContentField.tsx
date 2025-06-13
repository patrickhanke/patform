import { IconButton, SlideIn, StatelessToggle } from "@repo/ui";
import { EditContentFieldProps } from "./types";
import { useState, FC, ReactNode, useEffect } from "react";
import EditContent from "./components/EditContent";
import { WebpageContent, WebpageContentTable } from "@repo/types";
import { cloneDeep, set } from "lodash-es";
import { useDataHandler } from "@repo/provider";
import EditTable from "./content/EditTable";

const EditContentField: FC<EditContentFieldProps> = ({
	initialField,
	content,
	pageId,
	refetch
}) => {
	const { updateData } = useDataHandler();
	const [editContent, setEditContent] = useState(false);
	const [field, setField] = useState<WebpageContent>(initialField);

	const [secondaryContent, setSecondaryContent] = useState<ReactNode | null>(
		null
	);

	useEffect(() => {
		if (field.type === "table") {
			setSecondaryContent(
				<EditTable
					initialField={field["table"]}
					onChange={(table: WebpageContentTable["table"]) =>
						setField({
							...field,
							table: table
						})
					}
				/>
			);
		} else {
			setSecondaryContent(null);
		}
	}, [field]);

	return (
		<div className="flex row a-ce j-sb gap-sm w-100">
			<h3>{field.name}</h3>
			<div className="button_container">
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
				<IconButton icon="delete" onClick={() => null} />
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
		</div>
	);
};

export default EditContentField;
