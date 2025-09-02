import { ModuleOptionsField } from "../types";
import { v4 as generateUuid } from "uuid";

export const module_option_fields: ModuleOptionsField = {
	"/website": {
		path: "/website",
		name: "Webseite",
		icon: "website",
		settings: {
			categories: []
		},
		fields: [],
		position: 1,
		categories: [],
		connected_class: "Webpage",
		sub_menu: [
			{
				label: "Komponenten",
				value: "/components",
				icon: "tasks"
			},
			{
				label: "Inhalte",
				value: "/content",
				icon: "content"
			},
			{
				label: "Seiten",
				value: "/pages",
				icon: "pages"
			},
			{
				label: "Einstellungen",
				value: "/settings",
				icon: "settings"
			}
		]
	},
	"/articles": {
		path: "/articles",
		name: "Beiträge",
		icon: "article",
		settings: {
			categories: []
		},
		fields: [],
		position: 2,
		categories: [],
		connected_class: "Article",
		sub_menu: []
	},
	"/events": {
		path: "/events",
		name: "Events",
		icon: "events",
		settings: {
			categories: []
		},
		fields: [],
		position: 3,
		categories: [],
		connected_class: "Event",
		sub_menu: []
	},
	"/news": {
		path: "/news",
		name: "News",
		icon: "news",
		settings: {
			categories: []
		},
		fields: [],
		position: 4,
		categories: [],
		connected_class: "News",
		sub_menu: []
	},
	"/categories": {
		path: "/categories",
		name: "Kategorien",
		icon: "categories",
		settings: {
			categories: []
		},
		fields: [],
		position: 5,
		categories: [],
		connected_class: "Category",
		sub_menu: []
	},
	"/persons": {
		path: "/persons",
		name: "Personen",
		icon: "persons",
		settings: {
			categories: []
		},
		fields: [],
		position: 6,
		categories: [],
		connected_class: "Person",
		sub_menu: []
	},
	"/images": {
		path: "/images",
		name: "Bilder",
		icon: "images",
		settings: {
			categories: []
		},
		fields: [],
		position: 7,
		categories: [],
		connected_class: "Image",
		sub_menu: []
	},
	"/groups": {
		path: "/groups",
		name: "Trainingsgruppe",
		icon: "group",
		settings: {
			categories: []
		},
		fields: [],
		position: 2,
		categories: [],
		connected_class: "Group",
		sub_menu: []
	},
	"/training-group": {
		path: "/training-group",
		name: "Trainingsgruppe",
		icon: "group",
		settings: {
			categories: []
		},
		fields: [
			{
				id: generateUuid(),
				label: "Startalter",
				type: "number",
				name: "data.start_age",
				validation: {},
				position: 1,
				options: {
					number_start_value: 1,
					number_end_value: 100
				}
			},
			{
				id: generateUuid(),
				label: "Endalter",
				type: "number",
				name: "data.end_age",
				validation: {},
				position: 1,
				options: {
					number_start_value: 1,
					number_end_value: 100
				}
			}
		],
		position: 2,
		categories: [],
		connected_class: "Group",
		sub_menu: []
	},
	"/downloads": {
		path: "/downloads",
		name: "Downloads",
		icon: "downloads",
		settings: {
			categories: []
		},
		fields: [],
		position: 9,
		categories: [],
		connected_class: "Download",
		sub_menu: []
	},
	"/forms": {
		path: "/forms",
		name: "Formulare",
		icon: "forms",
		settings: {
			categories: []
		},
		fields: [],
		position: 10,
		categories: [],
		connected_class: "Form",
		sub_menu: []
	},
	"/users": {
		path: "/users",
		name: "Nutzer",
		icon: "users",
		settings: {
			categories: []
		},
		fields: [],
		position: 10,
		categories: [],
		connected_class: "_User",
		sub_menu: []
	},
	"/locations": {
		path: "/locations",
		name: "Orte",
		icon: "location",
		settings: {
			categories: []
		},
		fields: [],
		position: 11,
		categories: [],
		connected_class: "Location",
		sub_menu: []
	},
	"/calendar": {
		path: "/calendar",
		name: "Kalender",
		icon: "calendar",
		settings: {
			categories: []
		},
		fields: [],
		position: 12,
		categories: [],
		connected_class: "Dates",
		sub_menu: []
	}
};
