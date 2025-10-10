import { ModuleField } from "@repo/types";

const module_fields: ModuleField[] = [
	{
		id: "title",
		label: "Titel",
		required: false,
		type: "edit_string",
		active: false,
		position: 1,
		default: false
	},
	{
		id: "description",
		label: "Beschreibung",
		required: false,
		type: "edit_textfield",
		active: false,
		position: 2,
		default: false
	},
	{
		id: "text",
		label: "Text",
		required: false,
		type: "texteditor",
		active: false,
		position: 3,
		default: false
	},
	{
		id: "image",
		label: "Bild",
		required: false,
		type: "edit_image",
		active: false,
		position: 4,
		default: false
	},
	{
		id: "state",
		label: "Status",
		required: false,
		type: "edit_state",
		active: false,
		position: 5,
		default: false
	},
	{
		id: "gallery",
		label: "Galerie",
		required: false,
		type: "gallery",
		active: false,
		position: 6,
		default: false
	},
	{
		id: "color",
		label: "Farbe",
		required: false,
		type: "edit_color",
		active: false,
		position: 9,
		default: false
	},
	{
		id: "active",
		label: "Aktiv",
		required: false,
		type: "boolean",
		active: false,
		position: 10,
		default: false
	},
	{
		id: "file {name url}",
		label: "Datei",
		required: false,
		type: "file",
		active: false,
		position: 12,
		default: false
	},
	{
		id: "date",
		label: "Datum",
		required: false,
		type: "date_picker",
		active: false,
		position: 4,
		default: false
	},
	{
		id: "dates",
		label: "Termine",
		required: false,
		type: "edit_dates",
		active: false,
		position: 5,
		default: false
	},
	{
		id: "link",
		label: "Link",
		required: false,
		type: "edit_string",
		active: false,
		position: 5,
		default: false
	},
	{
		id: "documents",
		label: "Dokumente",
		required: false,
		type: "files",
		active: false,
		position: 5,
		default: false
	}
	// {
	// 	id: "webpage_components",
	// 	label: "Inhalt",
	// 	required: false,
	// 	type: "edit_webpage_components",
	// 	active: false,
	// 	position: 10,
	// 	default: false
	// },
	// {
	// 	id: "content",
	// 	label: "Inhalt",
	// 	required: false,
	// 	type: "content",
	// 	active: false,
	// 	position: 11,
	// 	default: false
	// },
] as const;

export default module_fields;
