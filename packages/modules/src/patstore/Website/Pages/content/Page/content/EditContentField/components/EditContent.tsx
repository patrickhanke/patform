import { FC, useCallback } from "react";
import content_type_options from "../constants/content_type_options";
import { Editor, ImageUploader, Select } from "@repo/ui";
import { EditContentProps } from "../types";
import { cloneDeep, set } from "lodash";

const EditContent: FC<EditContentProps> = ({ content, setContent }) => {
	const updateContent = useCallback(
		(key: string, value: string) => {
			const contentCopy = cloneDeep(content);
			set(contentCopy, `${key}`, value);
			setContent(contentCopy);
		},
		[content, setContent]
	);
	return (
		<div className="flex col al-st gap-md">
			<div>
				<label>Name des Elements (wird nicht angezeigt)</label>
				<input
					type="text"
					value={content.name}
					onChange={(e) => updateContent("name", e.target.value)}
					placeholder="Enter content name"
				/>
			</div>
			<Select
				label="Inhatsart"
				value={content.type}
				options={content_type_options}
				onChange={(selectElement) =>
					updateContent("type", selectElement.value)
				}
				placeholder="Select content type"
			/>
			{content.type === "text" && (
				<Editor
					label="Textinhalt"
					content={content.text || ""}
					onChange={(value) => updateContent("text", value)}
				/>
			)}
			{content.type === "video" && (
				<ImageUploader
					label="Videoinhalt"
					onChange={(value) =>
						updateContent("video", value as string)
					}
					maxFileCount={1}
					returnType="string"
					preview={false}
				/>
			)}
		</div>
	);
};

export default EditContent;
