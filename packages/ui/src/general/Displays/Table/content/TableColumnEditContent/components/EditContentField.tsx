import { IconButton } from "@repo/ui";
import { EditContentFieldProps } from "../types";

const EditContentField = ({
	field,
	setActiveIndex,
	index
}: EditContentFieldProps) => {
	return (
		<div className="flex row a-ce j-sb gap-sm w-100">
			<h3>{field.name}</h3>
			<div className="button_container">
				<IconButton
					disabled={index === -1}
					icon="edit"
					onClick={() => setActiveIndex(index)}
				/>
				<IconButton icon="delete" onClick={() => null} />
			</div>
		</div>
	);
};

export default EditContentField;
