import { PageCreateClassObject } from "@repo/ui";

const create_person: PageCreateClassObject = {
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
				required: "Pflichtfeld",
				min_length: 5,
				max_length: 36
			}
		},
		{
			id: "image",
			position: 3,
			name: "portrait",
			type: "image",
			options: {
				max_file_count: 1
			}
		}
	]
};

export default create_person;
