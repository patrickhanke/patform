import { ModuleFieldIds, Module } from "@repo/types";

const disabled_fields: {
	[key in Module["path"]]: ModuleFieldIds[];
} = {
	"/arcticles": [],
	"/events": [],
	"/groups": [],
	"/locations": [],
	"/persons": [],
	"/downloads": [],
	"/forms": [],
	"/images": ["image"],
	"/entries": [],
	"/categories": []
};

export default disabled_fields;
