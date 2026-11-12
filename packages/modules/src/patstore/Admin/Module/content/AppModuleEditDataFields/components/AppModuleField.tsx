import { IconButton } from "@repo/ui";
import fieldTypes from "../constants/fieldTypes";
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
				<p>
					{fieldTypes.find((item) => item.value === field.type)
						?.label ?? field.type}
					{field.name ? ` · ${field.name}` : ""}
				</p>
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
