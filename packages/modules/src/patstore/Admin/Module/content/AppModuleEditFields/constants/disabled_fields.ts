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
	"/images": ["image"],
	"/entries": [],
	"/categories": [],
	"/emails": [],
	"/calendar": [],
	"/website": [],
	"/users": [],
	"/videos": []
};

export default disabled_fields;
