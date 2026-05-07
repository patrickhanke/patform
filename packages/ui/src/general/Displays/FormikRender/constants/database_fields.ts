import { Field } from "../types";

const database_fields: Field[] = [
	{
		id: "title",
		position: 1,
		name: "title",
		type: "input",
		label: "Titel",
		validation: {
			required: "Pflichtfeld"
		}
	},
	{
		id: "description",
		position: 3,
		name: "description",
		type: "textarea",
		label: "Infotext"
	},
	{
		id: "text",
		position: 4,
		name: "text",
		type: "texteditor",
		label: "Text"
	},
	{
		id: "image",
		position: 5,
		name: "image",
		type: "image",
		label: "Bild",
		options: {
			max_file_count: 1,
			return_type: "string"
		}
	},
	{
		id: "date",
		position: 6,
		name: "date",
		type: "date",
		label: "Datum"
	},
	{
		id: "gallery",
		position: 8,
		name: "gallery",
		type: "image_select",
		label: "Galerie",
		options: {
			max_file_count: 20,
			return_type: "array"
		}
	},
	{
		id: "color",
		position: 9,
		name: "color",
		type: "color",
		label: "Farbe"
	},
	{
		id: "file",
		position: 11,
		name: "file",
		type: "file",
		label: "Datei"
	},
	{
		id: "documents",
		position: 12,
		name: "documents",
		type: "file",
		label: "Dokumente"
	},
	{
		id: "path",
		position: 12,
		name: "path",
		type: "input",
		label: "Pfad"
	},
	{
		id: "subtitle",
		position: 13,
		name: "subtitle",
		type: "textarea",
		label: "Untertitel"
	},
	{
		id: "type",
		position: 14,
		name: "type",
		type: "input",
		label: "Typ"
	}
];

export default database_fields;
