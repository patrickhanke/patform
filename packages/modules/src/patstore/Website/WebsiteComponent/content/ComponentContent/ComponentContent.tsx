import { FC } from "react";
import { ComponentContentProps } from "./types";
import { EditTable } from "./content";

const ComponentContent: FC<ComponentContentProps> = ({
	objectId,
	data,
	type
}) => {
	return (
		<div className="w-100">
			{type === "table" && (
				<EditTable initialData={data} objectId={objectId} />
			)}
		</div>
	);
};

export default ComponentContent;
