import { ModuleField } from "@repo/types";

const module_fields: ModuleField[] = [
	{
		id: "title",
		label: "Titel",
		required: false,
		type: "edit_string",
		active: true,
		position: 1,
		default: false,
		hidden: false
	},
	{
		id: "createdAt",
		label: "Erstellt am",
		required: false,
		type: "date",
		active: false,
		position: 2,
		default: false,
		hidden: false
	},
	{
		id: "updatedAt",
		label: "Aktualisiert am",
		required: false,
		type: "date",
		active: false,
		position: 2,
		default: false,
		hidden: false
	},
	{
		id: "description",
		label: "Beschreibung",
		required: false,
		type: "edit_textfield",
		active: false,
		position: 2,
		default: false,
		hidden: false
	},
	{
		id: "text",
		label: "Text",
		required: false,
		type: "texteditor",
		active: false,
		position: 3,
		default: false,
		hidden: false
	},
	{
		id: "image",
		label: "Bild",
		required: false,
		type: "edit_image",
		active: false,
		position: 4,
		default: false,
		hidden: false
	},
	{
		id: "state",
		label: "Status",
		required: false,
		type: "edit_state",
		active: false,
		position: 5,
		default: false,
		hidden: false
	},
	{
		id: "gallery",
		label: "Galerie",
		required: false,
		type: "gallery",
		active: false,
		position: 6,
		default: false,
		hidden: false
	},
	{
		id: "color",
		label: "Farbe",
		required: false,
		type: "edit_color",
		active: false,
		position: 9,
		default: false,
		hidden: false
	},
	{
		id: "active",
		label: "Aktiv",
		required: false,
		type: "boolean",
		active: false,
		position: 10,
		default: false,
		hidden: false
	},
	{
		id: "file",
		type: "file",
		label: "Datei",
		required: false,
		active: false,
		position: 12,
		default: false,
		hidden: false
	},
	{
		id: "date",
		label: "Datum",
		required: false,
		type: "date_picker",
		active: false,
		position: 13,
		default: false,
		hidden: false
	},
	{
		id: "dates",
		label: "Termine",
		required: false,
		type: "edit_dates",
		active: false,
		position: 14,
		default: false,
		hidden: false
	},
	{
		id: "times",
		label: "Zeiten",
		required: false,
		type: "edit_times",
		active: false,
		position: 15,
		default: false,
		hidden: false
	},
	{
		id: "link",
		label: "Link",
		required: false,
		type: "edit_string",
		active: false,
		position: 16,
		default: false,
		hidden: false
	},
	{
		id: "documents",
		label: "Dokumente",
		required: false,
		type: "files",
		active: false,
		position: 17,
		default: false,
		hidden: false
	},
	{
		id: "created_by",
		label: "Erstellt von",
		required: false,
		type: "user",
		active: false,
		position: 5,
		default: false,
		hidden: false
	},
	{
		id: "updated_by",
		label: "Aktualisiert von",
		required: false,
		type: "user",
		active: false,
		position: 18,
		default: false,
		hidden: false
	},
	{
		id: "location",
		label: "Ort",
		required: false,
		type: "location",
		active: false,
		position: 19,
		default: false,
		hidden: false
	},
	{
		id: "slug",
		label: "Slug",
		required: false,
		type: "string",
		active: false,
		position: 20,
		default: false,
		hidden: false
	},
	{
		id: "lang",
		label: "Sprache",
		required: false,
		type: "lang",
		active: false,
		position: 21,
		default: false,
		hidden: false
	}
] as const;

export default module_fields;
