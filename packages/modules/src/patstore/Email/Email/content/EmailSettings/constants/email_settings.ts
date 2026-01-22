const email_settings = {
	unsubscribe_link: {
		label: "Abmeldelink",
		value: true,
		description: "Abmeldelink am Ende der E-Mail anzeigen"
	},
	unsubscribe_url: {
		label: "Abmeldelink URL",
		value: "",
		description: "URL für den Abmeldelink (nur aktiv wenn Abmeldelink aktiviert ist)"
	},
	subject: {
		label: "E-Mail Betreff",
		value: "",
		description: "Betreff der E-Mail"
	}
} as const;

export default email_settings;
