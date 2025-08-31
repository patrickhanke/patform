import { FC, useCallback } from "react";
import content_type_options from "../constants/content_type_options";
import { Editor, ImageUploader, PatstoreSelectImages, Select } from "@repo/ui";
import { EditContentProps } from "../types";
import { cloneDeep, set } from "lodash";
import EditDivider from "./EditDivider";

const EditContent: FC<EditContentProps> = ({ content, setContent }) => {
	const updateContent = useCallback(
		(key: string, value: string | object) => {
			const contentCopy = cloneDeep(content);

			if (
				key === "type" &&
				value === "table" &&
				!("table" in contentCopy)
			) {
				set(contentCopy, "value", {
					columns: [],
					rows: [],
					settings: {
						title: "Neue Tabelle",
						description: "",
						footer: ""
					}
				});
			}

			if (
				key === "type" &&
				value === "divider" &&
				!("divider" in contentCopy)
			) {
				set(contentCopy, "value", {
					size: "medium",
					showLine: false
				});
			}
			set(contentCopy, `${key}`, value);
			setContent(contentCopy);
		},
		[content, setContent]
	);
	return (
		<div className="flex col a-st gap-md">
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
				label="Inhaltsart"
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
					content={content.value || ""}
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
			{content.type === "image" && (
				<PatstoreSelectImages
					onChange={(value) =>
						updateContent(content.type, value as string)
					}
					maxFileCount={1}
					image={content.value as string}
				/>
			)}
			{content.type === "divider" && (
				<EditDivider
					divider={content.value}
					onChange={(value) => updateContent(content.type, value)}
				/>
			)}
		</div>
	);
};

export default EditContent;
