import { PageCreateClassObject } from "@repo/ui";
import { NewsClass } from "@repo/types";

const createClass: PageCreateClassObject<NewsClass> = {
	className: "News",
	text: "Neue News erstellen",
	initialData: {
		categories: [],
		fields: [],
		data: {}
	},
	fields: [
		{
			id: "title",
			position: 1,
			name: "title",
			type: "input",
			label: "Name",
			validation: {
				validate: true,
				required: "Pflichtfeld",
				min_length: 5,
				max_length: 90
			}
		},
		{
			id: "text",
			position: 3,
			name: "text",
			type: "textarea",
			label: "Beschreibung",
			validation: {
				validate: true,
				required: "Pflichtfeld",
				min_length: 30,
				max_length: 240
			}
		},
		{
			id: "date",
			position: 4,
			name: "date",
			type: "date",
			label: "Datum",
			validation: {
				validate: true,
				required: "Pflichtfeld"
			}
		}
	]
};

export default createClass;
