import { PageCreateClassObject } from "@repo/ui";
const createEvent: PageCreateClassObject = {
	initialData: undefined,
	className: "Event",
	text: "Neues Event erstellen",
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
			id: "image",
			position: 2,
			name: "image",
			type: "image_select",
			label: "Bild",
			options: {
				return_type: "string",
				max_file_count: 1
			}
		},
		{
			id: "text",
			position: 3,
			name: "text",
			type: "textarea",
			label: "Beschreibung",
			validation: {
				required: "Pflichtfeld",
				min_length: 30,
				max_length: 180
			}
		}
	]
};

export default createEvent;
