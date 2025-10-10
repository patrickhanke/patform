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
		value: "persons_select",
		label: "Personen wählen"
	},
	{
		value: "person_select",
		label: "Person wählen"
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
