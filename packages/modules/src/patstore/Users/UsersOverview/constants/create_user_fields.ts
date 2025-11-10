import { Field } from "@repo/ui";

const create_user_fieds = (
	roles: { value: string; label: string }[]
): Field[] => [
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
	{
		label: `Benutzername`,
		id: "name",
		name: "name",
		type: "input",
		value: "",
		dataType: "string",
		placeholder: "Vor- und Nachname",
		validation: {
			validate: true,
			required: "Bitte geben Sie einen Benutzernamen ein"
		}
	},
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
	}
];

export default create_user_fieds;
