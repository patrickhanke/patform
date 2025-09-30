import { PageCreateClassObject } from "@repo/ui";

const createForm: PageCreateClassObject = {
	className: "Form",
	text: "Neues Formular erstellen",
	initialData: {
		description: "",
		settings: {
			static_form: false,
			response: false,
			notification: false,
			response_text: "",
			recipients: []
		}
	},
	fields: [
		{
			id: "name",
			position: 1,
			name: "name",
			type: "input",
			label: "Name",
			validation: {
				required: "Pflichtfeld",
				min_length: 5,
				max_length: 36
			}
		}
	]
};

export default createForm;
