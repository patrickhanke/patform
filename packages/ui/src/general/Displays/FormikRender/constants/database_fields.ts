import type { ModuleFieldType } from "@repo/types";
import { Field } from "@repo/types";

/**
 * ModuleFieldTypes used in module_fields.ts and special_fields.ts.
 * Every key must have a Formik Field equivalent below.
 */
type UsedModuleFieldType = Extract<
	ModuleFieldType,
	| "edit_string"
	| "string"
	| "date"
	| "edit_textfield"
	| "texteditor"
	| "edit_image"
	| "edit_state"
	| "gallery"
	| "edit_color"
	| "boolean"
	| "file"
	| "date_picker"
	| "edit_dates"
	| "edit_times"
	| "files"
	| "user"
	| "location"
	| "image_preview"
	| "connected_elements"
	| "edit_person"
	| "edit_team"
	| "edit_persons"
	| "edit_geopoint"
	| "edit_role"
	| "emails"
	| "video"
>;

/**
 * Maps ModuleField.type → Formik Field template.
 * Lookup key is ModuleFieldType; Field.type is the Formik input type.
 */
const database_fields = {
	string: {
		id: "string",
		name: "string",
		type: "input",
		label: "Text"
	},
	edit_string: {
		id: "edit_string",
		name: "edit_string",
		type: "input",
		label: "Text"
	},
	edit_textfield: {
		id: "edit_textfield",
		name: "edit_textfield",
		type: "textarea",
		label: "Textfeld"
	},
	texteditor: {
		id: "texteditor",
		name: "texteditor",
		type: "texteditor",
		label: "Text"
	},
	edit_image: {
		id: "edit_image",
		name: "edit_image",
		type: "image",
		label: "Bild",
		options: {
			max_file_count: 1,
			return_type: "string"
		}
	},
	image_preview: {
		id: "image_preview",
		name: "image_preview",
		type: "image",
		label: "Vorschaubild",
		options: {
			max_file_count: 1,
			return_type: "string"
		}
	},
	gallery: {
		id: "gallery",
		name: "gallery",
		type: "image_select",
		label: "Galerie",
		options: {
			max_file_count: 20,
			return_type: "array"
		}
	},
	edit_color: {
		id: "edit_color",
		name: "edit_color",
		type: "color",
		label: "Farbe"
	},
	boolean: {
		id: "boolean",
		name: "boolean",
		type: "toggle",
		label: "Aktiv"
	},
	file: {
		id: "file",
		name: "file",
		type: "file",
		label: "Datei"
	},
	files: {
		id: "files",
		name: "files",
		type: "file",
		label: "Dokumente"
	},
	date: {
		id: "date",
		name: "date",
		type: "date",
		label: "Datum"
	},
	date_picker: {
		id: "date_picker",
		name: "date_picker",
		type: "date",
		label: "Datum"
	},
	edit_dates: {
		id: "edit_dates",
		name: "edit_dates",
		type: "datetime",
		label: "Termine"
	},
	edit_times: {
		id: "edit_times",
		name: "edit_times",
		type: "time",
		label: "Zeiten"
	},
	edit_state: {
		id: "edit_state",
		name: "edit_state",
		type: "select",
		label: "Status",
		dataType: "string",
		select_options: []
	},
	edit_role: {
		id: "edit_role",
		name: "edit_role",
		type: "select",
		label: "Rolle",
		dataType: "string",
		select_options: []
	},
	user: {
		id: "user",
		name: "user",
		type: "pointer_select",
		label: "Benutzer",
		select_options: [],
		options: {
			pointer_class: "_User"
		}
	},
	location: {
		id: "location",
		name: "location",
		type: "pointer_select",
		label: "Ort",
		select_options: [],
		options: {
			pointer_class: "Location"
		}
	},
	edit_geopoint: {
		id: "edit_geopoint",
		name: "edit_geopoint",
		type: "input",
		label: "Standort"
	},
	connected_elements: {
		id: "connected_elements",
		name: "connected_elements",
		type: "input",
		label: "Verbundene Elemente"
	},
	emails: {
		id: "emails",
		name: "emails",
		type: "textarea",
		label: "E-Mail-Adressen"
	},
	video: {
		id: "video",
		name: "video",
		type: "input",
		label: "Video"
	}
} as const satisfies Record<UsedModuleFieldType, Field>;

export type DatabaseFieldType = keyof typeof database_fields;

export default database_fields;
