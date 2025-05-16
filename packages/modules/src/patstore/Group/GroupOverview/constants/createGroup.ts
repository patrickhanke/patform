import { PageCreateClassObject } from "@repo/ui";
import { GroupClass } from "@repo/types";

const createGroup: PageCreateClassObject<GroupClass> = {
	className: "Group",
	text: "Neue Gruppe erstellen",
	initialData: {
		state: "draft",
		categories: [],
		gallery: [],
		times: [],
		data: {},
		fields: [],
		image: "",
		persons: [],
		team: {}
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
				min_length: 3,
				max_length: 60
			}
		}
	]
};

export default createGroup;
