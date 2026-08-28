import { FC } from "react";
import { ComponentContentProps } from "./types";
import { EditFAQ, EditImage, EditTable, EditText, EditVideo } from "./content";

const ComponentContent: FC<ComponentContentProps> = ({
	objectId,
	data,
	type
}) => {
	return (
		<div className="w-100">
			{type === "text" && (
				<EditText initialData={data} objectId={objectId} />
			)}
			{type === "image" && (
				<EditImage initialData={data} objectId={objectId} />
			)}
			{type === "video" && (
				<EditVideo initialData={data} objectId={objectId} />
			)}
			{type === "table" && (
				<EditTable initialData={data} objectId={objectId} />
			)}
			{type === "faq" && (
				<EditFAQ initialData={data} objectId={objectId} />
			)}
		</div>
	);
};

export default ComponentContent;
