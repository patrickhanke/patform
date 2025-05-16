import { PageCreateClassObject } from "@repo/ui";
import { DateClass } from "@repo/types";

const createDate: PageCreateClassObject<DateClass> = {
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
				validate: true,
				required: "Pflichtfeld",
				min_length: 5,
				max_length: 36
			}
		}
	]
};

export default createDate;
