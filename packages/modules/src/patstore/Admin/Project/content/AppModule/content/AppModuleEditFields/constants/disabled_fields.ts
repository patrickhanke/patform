import { ModuleFieldIds, Module } from "@repo/types";

const disabled_fields: {
	[key in Module["path"]]: ModuleFieldIds[];
} = {
	"/articles": [],
	"/events": [],
	"/groups": [],
	"/locations": [],
	"/persons": [],
	"/downloads": [],
	"/forms": [],
	"/images": ["image"],
	"/entries": [],
	"/categories": [],
	"/emails": [],
	"/calendar": [],
	"/website": [],
	"/users": []
};

export default disabled_fields;
