import { Field } from "@repo/ui";

const form_fields_response: Field[] = [
	{
		label: "Automatische Antwort",
		id: "response",
		name: "response",
		description: "Automatische Antwort bei Eingang einer Anfrage",
		type: "toggle"
	},
	{
		label: "Betreff",
		id: "subject",
		name: "subject",
		description: "Antworttext",
		type: "input"
	},
	{
		label: "Absender E-Mail",
		id: "sender_email",
		name: "sender_email",
		description: "Absender E-Mail",
		type: "input"
	},
	{
		label: "Antworttext",
		id: "response_text",
		name: "response_text",
		description: "Antworttext",
		type: "texteditor"
	}
];

export default form_fields_response;
