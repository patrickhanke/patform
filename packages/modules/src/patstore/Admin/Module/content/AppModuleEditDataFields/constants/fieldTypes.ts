const fieldTypes = [
	{
		value: "input",
		label: "Text"
	},
	{
		value: "url",
		label: "URL"
	},
	{
		value: "number",
		label: "Number"
	},
	{
		value: "toggle",
		label: "Ja / Nein"
	},
	{
		value: "password",
		label: "Password"
	},
	{
		value: "textarea",
		label: "Textarea"
	},
	{
		value: "select",
		label: "Select"
	},
	{
		value: "texteditor",
		label: "Texteditor"
	},
	{
		value: "image",
		label: "Bild wählen"
	},
	{
		value: "download",
		label: "Download wählen"
	}
] as const;

export default fieldTypes;
