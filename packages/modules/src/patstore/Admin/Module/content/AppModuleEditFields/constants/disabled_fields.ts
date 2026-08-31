import { ModuleFieldIds, Module } from "@repo/types";

const disabled_fields: {
	[key in Module["path"]]: ModuleFieldIds[];
} = {
	"/articles": [],
	"/events": [],
	"/groups": [],
	"/locations": [],
	"/people": [],
	"/downloads": [],
	"/forms": [],
	"/images": ["image", "state"],
	"/entries": [],
	"/categories": [],
	"/emails": [],
	"/calendar": [],
	"/website": [],
	"/users": [],
	"/videos": [],
	"/competitions": [],
	"/clubs": []
};

export default disabled_fields;
