import { Field } from "@repo/types";

const fields: Field[] = [
	{
		id: "color_label",
		name: "label",
		label: "Bezeichnung",
		type: "input",
		placeholder: "Primärfarbe",
		validation: {
			validate: true,
			required: "Bezeichnung ist ein Pflichtfeld"
		}
	},
	{
		id: "color_value",
		name: "value",
		label: "Farbe",
		type: "color"
	}
];

export default fields;
