import {
	CreateButton,
	Divider,
	Editor,
	IconButton,
	usePageData
} from "@repo/ui";
import { FC } from "react";
import { v4 } from "uuid";
import { WebpageComponentFaq } from "@repo/types";
import { EditFAQProps } from "./types";
import EditFaqSettings from "./components/EditFaqSettings";

const createInitialFaqData = (
	initialData?: EditFAQProps["initialData"]
): WebpageComponentFaq => {
	const settings =
		initialData &&
		typeof initialData === "object" &&
		"settings" in initialData &&
		initialData.settings &&
		typeof initialData.settings === "object"
			? {
					title:
						"title" in initialData.settings &&
						typeof initialData.settings.title === "string"
							? initialData.settings.title
							: "FAQ",
					description:
						"description" in initialData.settings &&
						typeof initialData.settings.description === "string"
							? initialData.settings.description
							: "",
					footer:
						"footer" in initialData.settings &&
						typeof initialData.settings.footer === "string"
							? initialData.settings.footer
							: "",
					showHeader:
						"showHeader" in initialData.settings &&
						typeof initialData.settings.showHeader === "boolean"
							? initialData.settings.showHeader
							: false
				}
			: {
					title: "FAQ",
					description: "",
					footer: "",
					showHeader: false
				};

	const elements =
		initialData &&
		typeof initialData === "object" &&
		"elements" in initialData &&
		Array.isArray(initialData.elements)
			? initialData.elements.map((element, index) => ({
					id:
						element &&
						typeof element === "object" &&
						"id" in element &&
						typeof element.id === "string"
							? element.id
							: `${index}`,
					header:
						element &&
						typeof element === "object" &&
						"header" in element &&
						typeof element.header === "string"
							? element.header
							: "",
					content:
						element &&
						typeof element === "object" &&
						"content" in element &&
						typeof element.content === "string"
							? element.content
							: ""
				}))
			: [];

	return { settings, elements };
};

const EditFAQ: FC<EditFAQProps> = ({ initialData, objectId }) => {
	const { data: faq, setData } = usePageData<WebpageComponentFaq>(
		{ initialData: createInitialFaqData(initialData), objectId },
		{
			className: "Content",
			updateObject: (data) => ({ data }),
			message: "Inhalt gespeichert"
		}
	);

	if (!faq) return null;

	const handleAddElement = () => {
		setData("elements", [
			...faq.elements,
			{
				id: v4(),
				header: "",
				content: ""
			}
		]);
	};

	const handleRemoveElement = (elementId: string) => {
		setData(
			"elements",
			faq.elements.filter((element) => element.id !== elementId)
		);
	};

	return (
		<div>
			<EditFaqSettings data={faq} setData={setData} />
			<Divider size="large" showLine={false} />
			<div className="content_element">
				<h3>Fragen</h3>
				<Divider size="medium" showLine={false} />
				<div className="flex col gap-md">
					{faq.elements.map((element, index) => (
						<div key={element.id} className="flex col gap-sm">
							<div className="flex row a-ce j-sb gap-md">
								<h4>Frage {index + 1}</h4>
								<IconButton
									icon="delete"
									onClick={() =>
										handleRemoveElement(element.id)
									}
									size={16}
								/>
							</div>
							<div>
								<h4>Frage</h4>
								<input
									type="text"
									defaultValue={element.header}
									onChange={(e) =>
										setData(
											`elements.${index}.header`,
											e.target.value,
											1000
										)
									}
									placeholder="Frage"
								/>
							</div>
							<div>
								<h4>Antwort</h4>
								<Editor
									content={element.content}
									onChange={(value) =>
										setData(
											`elements.${index}.content`,
											value
										)
									}
									placeholder="Antwort eingeben…"
								/>
							</div>
						</div>
					))}
				</div>
				<Divider size="medium" showLine={false} />
				<CreateButton
					text="Frage hinzufügen"
					onClick={handleAddElement}
					size="small"
				/>
			</div>
		</div>
	);
};

export default EditFAQ;
