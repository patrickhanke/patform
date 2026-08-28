import { PageCreateClassObject } from "@repo/ui";
import { ContentClass } from "@repo/types";

const createWebpageContenClass: PageCreateClassObject<ContentClass> = {
	className: "Content",
	text: "Neue Komponente erstellen",
	initialData: {
		title: "",
		content_id: "",
		type: ""
	},
	fields: [
		{
			id: "title",
			position: 1,
			name: "title",
			type: "edit_string",
			label: "Titel (Der Titel der Komponente)",
			required: true,
			active: true
		},
		{
			id: "content_id",
			position: 2,
			name: "content_id",
			type: "edit_string",
			label: "ID (Die ID der Komponente)",
			required: true,
			active: true
		},
		{
			id: "type",
			position: 3,
			name: "type",
			type: "content_type",
			label: "Typ",
			required: true,
			active: true
		}
	]
};

export default createWebpageContenClass;
