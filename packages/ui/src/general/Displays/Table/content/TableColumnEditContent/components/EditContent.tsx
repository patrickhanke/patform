import { FC, useCallback } from "react";
import content_type_options from "../constants/content_type_options";
import { Editor, Select } from "@repo/ui";
import { EditContentProps } from "../types";
import { cloneDeep, set } from "lodash";

const EditContent: FC<EditContentProps> = ({
	content,
	setContent,
	activeIndex
}) => {
	console.log({ content });

	const updateContent = useCallback(
		(key: string, value: string) => {
			const contentCopy = cloneDeep(content);
			set(contentCopy, `[${activeIndex}].${key}`, value);
			setContent(contentCopy);
		},
		[content, activeIndex, setContent]
	);
	return (
		<div className="flex col a-st gap-md">
			<div>
				<label>Name des Elements (wird nicht angezeigt)</label>
				<input
					type="text"
					value={content[activeIndex]?.name}
					onChange={(e) => updateContent("name", e.target.value)}
					placeholder="Enter content name"
				/>
			</div>
			<Select
				label="Inhatsart"
				value={content[activeIndex]?.type}
				options={content_type_options}
				onChange={(selectElement) =>
					updateContent("type", selectElement.value)
				}
				placeholder="Select content type"
			/>
			{content[activeIndex]?.type === "text" && (
				<Editor
					label="Textinhalt"
					content={content[activeIndex]?.value || ""}
					onChange={(value) => updateContent("text", value)}
				/>
			)}
			{content[activeIndex]?.type === "video" && (
				<p>
					Videoinhalte werden noch nicht unterstützt. Bitte nutzen Sie
					stattdessen einen Text-Inhalt.
				</p>
			)}
		</div>
	);
};

export default EditContent;
