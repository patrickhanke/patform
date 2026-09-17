import { PageCreateClassObject } from "@repo/ui";
import { ContentClass } from "@repo/types";

const createWebpageContenClass: PageCreateClassObject<ContentClass> = {
	className: "Content",
	text: "Neue Komponente erstellen",
	initialData: {
		title: "",
		content_id: "",
		type: "email",
		data: {
			content: []
		}
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
		}
	]
};

export default createWebpageContenClass;
