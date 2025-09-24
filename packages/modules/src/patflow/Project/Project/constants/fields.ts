import { Field } from "@repo/ui";

const fields: Field[] = [
	{
		id: "project_name",
		name: "name",
		label: "Projektname",
		type: "input",
		validation: {
			required: "Name ist ein Pflichtfeld"
		}
	},
	{
		id: "logo",
		name: "logo",
		label: "Logo",
		type: "image_upload",
		options: {
			max_file_count: 1,
			return_type: "string"
		}
	},
	{
		id: "name",
		name: "data.name",
		label: "Name",
		type: "input"
	},
	{
		id: "street",
		name: "data.street",
		label: "Straße",
		type: "input",
		validation: {
			required: "Straße ist ein Pflichtfeld"
		}
	},
	{
		id: "zip",
		name: "data.zip",
		label: "PLZ",
		type: "input",
		validation: {
			required: "PLZ ist ein Pflichtfeld"
		}
	},
	{
		id: "city",
		name: "data.city",
		label: "Stadt",
		type: "input",
		validation: {
			required: "Stadt ist ein Pflichtfeld"
		}
	}
];

export default fields;
