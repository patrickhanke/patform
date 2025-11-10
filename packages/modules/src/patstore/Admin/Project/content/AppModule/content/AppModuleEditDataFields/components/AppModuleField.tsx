import { IconButton } from "@repo/ui";

import { AppModuleFieldProps } from "../types";

const AppModuleField = ({
	field,
	setActiveField,
	deleteField
}: AppModuleFieldProps) => {
	return (
		<div>
			<div>
				<h3>{field.label}</h3>
			</div>
			<div className="button_container">
				<IconButton
					icon="edit"
					onClick={() => setActiveField(field.id)}
				/>
				<IconButton
					icon="delete"
					onClick={() => deleteField(field.id)}
				/>
			</div>
		</div>
	);
};

export default AppModuleField;
