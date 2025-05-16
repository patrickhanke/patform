import { PageCreateClassObject } from "@repo/ui";
import { PersonClass } from "@repo/types";

const create_person: PageCreateClassObject<PersonClass> = {
	initialData: undefined,
	className: "Person",
	text: "Neue Person erstellen",
	fields: [
		{
			id: "name",
			position: 1,
			name: "name",
			type: "input",
			label: "Name",
			validation: {
				validate: true,
				required: "Pflichtfeld",
				min_length: 5,
				max_length: 36
			}
		},
		{
			id: "email",
			position: 1,
			name: "email",
			type: "input",
			label: "E-Mail",
			validation: {
				validate: true,
				email: true
			}
		},
		{
			id: "image",
			position: 3,
			name: "portrait",
			type: "image",
			label: "Portrait",
			options: {
				return_type: "string",
				max_file_count: 1
			}
		}
	]
};

export default create_person;
