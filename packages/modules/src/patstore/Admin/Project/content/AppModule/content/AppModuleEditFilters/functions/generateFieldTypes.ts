import { ModuleFieldType, ModuleFilterType } from "@repo/types";

const generateFieldTypes = (type: ModuleFieldType): ModuleFilterType | null => {
	switch (type) {
		case "string":
		case "edit_string":
			return "string";
		case "boolean":
			return "boolean";
		case "image":
			return "exists";
		case "category":
			return null;
		case "textfield":
		case "edit_textfield":
		case "texteditor":
		case "edit_texteditor":
			return "string";
		case "date":
			return "string";
		case "state":
		case "edit_state":
			return "select";
		case "person":
		case "edit_person":
		case "location":
			return "id";
		case "edit_persons":
			return "ids";
		case "updated_by":
		case "created_by":
		case "user":
			return "pointer";
		default:
			return null;
	}
};

export default generateFieldTypes;
