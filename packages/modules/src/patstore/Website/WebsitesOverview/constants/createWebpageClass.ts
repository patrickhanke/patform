import { PageCreateClassObject } from "@repo/ui";
import { WebpageClass } from "@repo/types";

const createClass: PageCreateClassObject<WebpageClass> = {
	className: "Webpage",
	text: "Neue Seite erstellen",
	initialData: {
		categories: [],
		content: [],
		fields: [],
		documents: [],
		data: {}
	},
	fields: [
		{
			id: "path",
			position: 1,
			name: "path",
			type: "edit_string",
			label: "Pfad (die URL der Seite im Format /...)",
			required: true,
			active: true
		},
		{
			id: "title",
			position: 1,
			name: "title",
			type: "edit_string",
			label: "Titel (Der Titel der Seite)",
			required: true,
			active: true
		},
		{
			id: "subtitle",
			position: 3,
			name: "subtitle",
			type: "edit_textfield",
			label: "Untertitel (Der Untertitel der Seite)",
			required: true,
			active: true
		},
		{
			id: "type",
			position: 1,
			name: "type",
			type: "edit_string",
			label: "Typ (Optional, um die Seite zu kategorisieren)",
			required: false,
			active: true
		}
	]
};

export default createClass;
