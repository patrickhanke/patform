const form_settings = {
	notification: {
		label: "Benachrichtigung",
		value: true,
		description: "Benachrichtigung bei Eingang einer Anfrage"
	},
	recipients: {
		label: "Empfänger",
		value: [],
		description:
			"E-Mail Empfänger, falls eine Anfrage für das Formular eingeht"
	},
	response: {
		label: "Antwort",
		value: true,
		description: "Automatische Antwort bei Eingang einer Anfrage",
		fields: [
			{
				
			},
			{
				label: "Antworttext",
				value: "response_text",
				description: "Antworttext",
				type: "text"
			},
			{
				label: "Absender E-Mail",
				value: "sender_email",
				description: "Absender E-Mail",
				type: "text"
			}
		]
	},
	static_form: {
		label: "Statisches Formular",
		value: true,
		description: "Statisches Formular, das nicht bearbeitet werden kann"
	}
} as const;

export default form_settings;
