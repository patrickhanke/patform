import { PageCreateClassObject } from "@repo/ui";

const createGroup: PageCreateClassObject = {
	initialData: undefined,
	className: "Group",
	text: "Neue Gruppe erstellen",
	fields: [
		{
			id: "title",
			position: 1,
			name: "title",
			type: "input",
			label: "Name",
			validation: {
				required: "Pflichtfeld",
				min_length: 5,
				max_length: 36
			}
		},
		{
			id: "text",
			position: 3,
			name: "text",
			type: "textarea",
			label: "Beschreibung"
		}
	]
};

export default createGroup;
