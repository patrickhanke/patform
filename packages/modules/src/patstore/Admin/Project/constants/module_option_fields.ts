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
		data_fields: [],
		default_fields: [],
		position: 1,
		categories: [],
		setting_fields: [],
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
		data_fields: [],
		position: 2,
		categories: [],
		connected_class: "Article",
		sub_menu: [],
		setting_fields: [],
		default_fields: ["title", "text", "image"]
	},
	"/events": {
		path: "/events",
		name: "Events",
		icon: "events",
		settings: {
			categories: []
		},
		fields: [],
		data_fields: [],
		position: 3,
		categories: [],
		connected_class: "Event",
		sub_menu: [],
		setting_fields: [],
		default_fields: ["title", "dates"]
	},
	"/entries": {
		path: "/entries",
		name: "News",
		icon: "news",
		settings: {
			categories: []
		},
		fields: [],
		data_fields: [],
		position: 4,
		categories: [],
		connected_class: "Entry",
		sub_menu: [],
		setting_fields: [],
		default_fields: ["title", "text"]
	},
	"/categories": {
		path: "/categories",
		name: "Kategorien",
		icon: "categories",
		settings: {
			categories: []
		},
		fields: [],
		data_fields: [],
		position: 5,
		categories: [],
		connected_class: "Category",
		sub_menu: [],
		setting_fields: [],
		default_fields: ["title"]
	},
	"/persons": {
		path: "/persons",
		name: "Personen",
		icon: "persons",
		settings: {
			categories: []
		},
		fields: [],
		data_fields: [],
		position: 6,
		categories: [],
		connected_class: "Person",
		sub_menu: [],
		setting_fields: [],
		default_fields: ["title", "image"]
	},
	"/images": {
		path: "/images",
		name: "Bilder",
		icon: "images",
		settings: {
			categories: []
		},
		fields: [],
		data_fields: [],
		position: 7,
		categories: [],
		connected_class: "Image",
		sub_menu: [],
		setting_fields: [],
		default_fields: ["title", "file"]
	},
	"/groups": {
		path: "/groups",
		name: "Trainingsgruppe",
		icon: "group",
		settings: {
			categories: []
		},
		fields: [],
		data_fields: [],
		position: 2,
		categories: [],
		connected_class: "Group",
		sub_menu: [],
		setting_fields: [],
		default_fields: ["title"]
	},
	"/training-group": {
		path: "/groups",
		name: "Trainingsgruppe",
		icon: "group",
		settings: {
			categories: []
		},
		data_fields: [],
		fields: [
			{
				id: generateUuid(),
				label: "Startalter",
				type: "number",
				name: "data.start_age",
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
		sub_menu: [],
		setting_fields: [],
		default_fields: ["title"]
	},
	"/downloads": {
		path: "/downloads",
		name: "Downloads",
		icon: "downloads",
		settings: {
			categories: []
		},
		fields: [],
		data_fields: [],
		position: 9,
		categories: [],
		connected_class: "Download",
		sub_menu: [],
		setting_fields: [],
		default_fields: ["title", "file"]
	},
	"/forms": {
		path: "/forms",
		name: "Formulare",
		icon: "forms",
		settings: {
			categories: []
		},
		fields: [],
		data_fields: [],
		position: 10,
		categories: [],
		connected_class: "Form",
		sub_menu: [],
		setting_fields: [],
		default_fields: ["title", "text"]
	},
	"/users": {
		path: "/users",
		name: "Nutzer",
		icon: "users",
		settings: {
			categories: []
		},
		fields: [],
		data_fields: [],
		position: 10,
		categories: [],
		connected_class: "User",
		sub_menu: [],
		setting_fields: [],
		default_fields: []
	},
	"/locations": {
		path: "/locations",
		name: "Orte",
		icon: "location",
		settings: {
			categories: []
		},
		fields: [],
		data_fields: [],
		position: 11,
		categories: [],
		connected_class: "Location",
		setting_fields: [],
		sub_menu: [],
		default_fields: ["title"]
	},
	"/calendar": {
		path: "/calendar",
		name: "Kalender",
		icon: "calendar",
		settings: {
			categories: []
		},
		fields: [],
		data_fields: [],
		position: 12,
		categories: [],
		connected_class: "Dates",
		sub_menu: [],
		setting_fields: [],
		default_fields: []
	},
	"/emails": {
		path: "/emails",
		name: "E-Mails",
		icon: "email",
		settings: {
			categories: []
		},
		fields: [],
		data_fields: [],
		position: 13,
		categories: [],
		connected_class: "Email",
		sub_menu: [
			{
				label: "E-Mails",
				value: "/emails",
				icon: "email"
			},
			{
				label: "E-Mail-Vorlagen",
				value: "/templates",
				icon: "templates"
			}
		],
		setting_fields: [],
		default_fields: []
	}
};
