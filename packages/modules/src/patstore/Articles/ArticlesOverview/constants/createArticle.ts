import { CreateClassProps } from "@repo/ui";
import { ArticleClass } from "@repo/types";

const createArticle: CreateClassProps<ArticleClass> = {
	initialData: {
		state: "draft",
		categories: [],
		gallery: []
	},
	className: "Article",
	text: "Beitrag erstellen",
	fields: [
		{
			id: "title",
			position: 1,
			name: "title",
			type: "input",
			label: "Titel",
			validation: {
				validate: true,
				required: "Pflichtfeld"
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
			},
			validation: {
				validate: true,
				required: "Pflichtfeld"
			}
		},
		{
			id: "text",
			position: 3,
			name: "text",
			type: "texteditor",
			label: "Text",
			placeholder: "Text des Artikels",
			validation: {
				validate: true,
				required: "Pflichtfeld"
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

export default createArticle;
