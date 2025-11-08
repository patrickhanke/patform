const module_fields = [
	{
		id: "title",
		label: "Titel",
		required: false,
		type: "edit_string",
		active: true
	},
	{
		id: "description",
		label: "Beschreibung",
		required: false,
		type: "edit_textfield",
		active: true
	},
	{
		id: "image",
		label: "Bild",
		required: false,
		type: "edit_image",
		active: true
	},
	{
		id: "date",
		label: "Datum",
		required: false,
		type: "edit_date",
		active: true
	},
	{
		id: "dates",
		label: "Termine",
		required: false,
		type: "edit_dates",
		active: true
	},
	{
		id: "coordinates",
		label: "Ort",
		required: false,
		type: "edit_geopoint",
		active: true
	},
	{
		id: "gallery",
		label: "Status",
		required: false,
		type: "gallery",
		active: true
	},
	{
		id: "team",
		label: "Team",
		required: false,
		type: "edit_team",
		active: true
	},
	{
		id: "color",
		label: "Farbe",
		required: false,
		type: "edit_color",
		active: true
	},
	{
		id: "webpage_components",
		label: "Inhalt",
		required: false,
		type: "edit_webpage_components",
		active: true
	},
	{
		id: "content",
		label: "Inhalt",
		required: false,
		type: "content",
		active: true
	},
	{
		id: "file",
		label: "Kategorien",
		required: false,
		type: "file",
		active: true
	}
];

export default module_fields;
