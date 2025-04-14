import { IconButton } from "@repo/ui";
import { EditContentFieldProps } from "../types";

const EditContentField = ({ field, setActiveIndex }: EditContentFieldProps) => {
	return (
		<div className="flex row al-ce j-sb gap-sm w-100">
			<h3>{field.name}</h3>
			<div className="button_container">
				<IconButton icon="edit" onClick={() => setActiveIndex()} />
				<IconButton icon="delete" onClick={() => null} />
			</div>
		</div>
	);
};

export default EditContentField;
