import { Field } from "@repo/ui";

const create_user_fieds = (
	roles: { value: string; label: string }[],
	useSeparateNames: boolean = false
): Field[] => [
	{
		label: `Anrede`,
		id: "salutation",
		name: "salutation",
		type: "input",
		value: "",
		placeholder: "Anrede auswählen"
	},
	{
		label: `Titel`,
		id: "title",
		name: "title",
		type: "input",
		value: "",
		placeholder: "Prof."
	},
	{
		label: `E-Mail Adresse`,
		id: "username",
		name: "username",
		type: "input",
		value: "",
		placeholder: "beispiel@email.de",
		validation: {
			validate: true,
			required: "Bitte geben Sie eine E-Mail-Adresse ein",
			email: true
		}
	},
	...(useSeparateNames
		? [
				{
					label: `Vorname`,
					id: "first_name",
					name: "first_name",
					type: "input" as const,
					value: "",
					dataType: "string" as const,
					placeholder: "Vorname",
					validation: {
						validate: true,
						required: "Bitte geben Sie einen Vornamen ein"
					}
				},
				{
					label: `Nachname`,
					id: "last_name",
					name: "last_name",
					type: "input" as const,
					value: "",
					dataType: "string" as const,
					placeholder: "Nachname",
					validation: {
						validate: true,
						required: "Bitte geben Sie einen Nachnamen ein"
					}
				}
			]
		: [
				{
					label: `Benutzername`,
					id: "name",
					name: "name",
					type: "input" as const,
					value: "",
					dataType: "string" as const,
					placeholder: "Vor- und Nachname",
					validation: {
						validate: true,
						required: "Bitte geben Sie einen Benutzernamen ein"
					}
				}
			]),
	{
		label: `Rolle`,
		id: "role",
		name: "role",
		type: "select",
		value: "",
		select_options: roles,
		dataType: "string",
		placeholder: "Rolle auswählen",
		validation: {
			validate: true,
			required: "Bitte wählen Sie eine Rolle aus"
		}
	},
	{
		label: "Passwort",
		id: "password",
		name: "password",
		type: "password",
		value: "",
		placeholder: "Passwort",
		validation: {
			validate: true,
			required: "Bitte geben Sie ein Passwort ein"
		}
	}
];

export default create_user_fieds;
