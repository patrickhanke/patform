import { PageCreateClassObject } from "@repo/ui";

const createDate: PageCreateClassObject = {
	initialData: undefined,
	className: "Date",
	text: "Neuen Kalendereintrag erstellen",
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
		}
	]
};

export default createDate;
