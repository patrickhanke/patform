import {
	CreateButton,
	Divider,
	DnDDisplay,
	SlideIn,
	sortItemsByPosition
} from "@repo/ui";
import { FC, useCallback, useState } from "react";
import { WebpageContent } from "@repo/types";
import { v4 } from "uuid";
import { TableColumnEditContentProps } from "./types";
import EditContentField from "./components/EditContentField";
import initial_content_element from "./constants/initial_content_element";
import { cloneDeep } from "lodash";
import EditContent from "./components/EditContent";

const TableColumnEditContent: FC<TableColumnEditContentProps> = ({
	initialData,
	onChange
}) => {
	const [activeIndex, setActiveIndex] = useState<number | null>(null);
	const [content, setContent] = useState<WebpageContent[]>(initialData || []);
	const [loading, setLoading] = useState(false);
	const [editContent, setEditContent] = useState(false);

	console.log(content);
	console.log(activeIndex);

	const slideInConfirmHandler = useCallback(async () => {
		setLoading(true);
		console.log(content);

		await onChange(content);
		setLoading(false);
	}, [content, onChange]);

	const findIndexOfItem: (id: string) => number | null = useCallback(
		(id: string) => {
			return content.findIndex((item) => item.id === id);
		},
		[content]
	);

	return (
		<>
			<div className="button_container">
				<button
					className="full_button sm grey"
					onClick={() => setEditContent(true)}
				>
					Inhalte bearbeiten
				</button>
			</div>
			<SlideIn
				cancel={() => setEditContent(false)}
				confirm={() => slideInConfirmHandler()}
				isOpen={editContent}
				header="Inhalte bearbeiten"
				showSecondaryContent={true}
				secondaryContent={
					typeof activeIndex === "number" && activeIndex >= 0 ? (
						<EditContent
							content={content}
							setContent={setContent}
							activeIndex={activeIndex}
						/>
					) : null
				}
				disabled={[loading, loading]}
			>
				<div>
					<CreateButton
						text="Inhaltselement hinzufügen"
						size="small"
						onClick={() => {
							const contentCopy = cloneDeep(content);
							contentCopy.push({
								...initial_content_element,
								position: contentCopy.length + 1,
								id: v4() as string
							});
							return setContent(contentCopy);
						}}
					/>
					<Divider size="small" showLine={false} />
					<DnDDisplay<WebpageContent[]>
						items={
							(sortItemsByPosition(
								content
							) as WebpageContent[]) || []
						}
						ItemComponent={({ item, id }) => (
							<EditContentField
								field={item as WebpageContent}
								setActiveIndex={() =>
									setActiveIndex(findIndexOfItem(id))
								}
							/>
						)}
						objectClass="Module"
						// subField={{ id: moduleId, field: "categories" }}
					/>
				</div>
			</SlideIn>
		</>
	);
};

export default TableColumnEditContent;
