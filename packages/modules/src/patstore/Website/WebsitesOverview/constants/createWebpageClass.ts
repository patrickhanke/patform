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
			type: "input",
			label: "Pfad (die URL der Seite im Format /...)",
			required: true,
			active: true
		},
		{
			id: "title",
			position: 1,
			name: "title",
			type: "input",
			label: "Titel (Der Titel der Seite)",
			required: true,
			active: true
		},
		{
			id: "subtitle",
			position: 3,
			name: "subtitle",
			type: "textarea",
			label: "Untertitel (Der Untertitel der Seite)",
			required: true,
			active: true
		},
		{
			id: "type",
			position: 1,
			name: "type",
			type: "input",
			label: "Typ (Optional, um die Seite zu kategorisieren)",
			required: true,
			active: true
		}
	]
};

export default createClass;
