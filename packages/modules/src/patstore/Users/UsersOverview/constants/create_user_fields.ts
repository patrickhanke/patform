import { Field } from "@repo/ui";

const create_user_fieds: Field[] = [
	{
		label: `E-Mail Adresse`,
		id: "username",
		name: "username",
		type: "input",
		value: "",
		placeholder: "beispiel@email.de",
		validation: {
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
			required: "Bitte geben Sie einen Benutzernamen ein"
		}
	}
];

export default create_user_fieds;
