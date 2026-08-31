import { ModuleFieldIds, Module } from "@repo/types";

const default_fields: {
	[key in Module["path"]]: ModuleFieldIds[];
} = {
	"/articles": ["title", "text", "image", "date", "state"],
	"/events": ["title", "description", "dates", "state"],
	"/groups": ["title", "description", "text", "image", "state"],
	"/locations": ["title", "state"],
	"/people": ["title", "description", "text", "image", "state"],
	"/downloads": ["title", "description", "file", "state"],
	"/forms": ["title", "state"],
	"/images": ["title", "description"],
	"/entries": ["title", "state"],
	"/categories": ["title", "state"],
	"/emails": ["title"],
	"/calendar": ["title"],
	"/website": ["title"],
	"/users": ["title"],
	"/videos": ["title"],
	"/competitions": ["title"],
	"/clubs": ["title"]
};

export default default_fields;
