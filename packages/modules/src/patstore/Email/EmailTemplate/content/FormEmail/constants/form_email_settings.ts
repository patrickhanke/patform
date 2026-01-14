const form_email_settings = {
	"server.host": {
		label: "Die Url des E-Mail Servers",
		value: "",
		description:
			"Geben Sie die URL des E-Mail Servers an, der für den Versand von E-Mails verwendet wird."
	},
	"server.port": {
		label: "Port",
		value: null,
		description:
			"Geben Sie den Port des E-Mail Servers an, der für den Versand von E-Mails verwendet wird. Standardmäßig ist dies 587 für TLS oder 465 für SSL."
	},
	"server.secure": {
		label: "Sichere Verbindung (SSL/TLS)",
		value: false,
		description:
			"Geben Sie an, ob eine sichere Verbindung (SSL/TLS) für den E-Mail Versand verwendet werden soll."
	},
	"server.requireTLS": {
		label: "requireTLS",
		value: false,
		description:
			"Geben Sie an, ob eine TLS-Verschlüsselung für den E-Mail Versand erforderlich ist."
	},
	"server.auth": {
		label: "Authentifizierung",
		value: false,
		description:
			"Geben Sie an, ob eine Authentifizierung für den E-Mail Versand erforderlich ist."
	},
	"server.username": {
		label: "Benutzername",
		value: "",
		description:
			"Geben Sie den Benutzernamen für die E-Mail Authentifizierung an."
	},
	"server.password": {
		label: "Passwort",
		value: "",
		description:
			"Geben Sie das Passwort für die E-Mail Authentifizierung an."
	},
	"server.from": {
		label: "Absender E-Mail",
		value: "",
		description:
			"Geben Sie die E-Mail Adresse an, von der die E-Mails gesendet werden sollen."
	}
} as const;

export default form_email_settings;
