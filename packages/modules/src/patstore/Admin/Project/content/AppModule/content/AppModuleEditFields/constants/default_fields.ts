import { ModuleFieldIds, Module } from "@repo/types";

const default_fields: {
	[key in Module["path"]]: ModuleFieldIds[];
} = {
	"/arcticles": ["title", "text", "image", "date"],
	"/events": ["title", "description", "dates"],
	"/groups": ["title", "description", "text", "image"],
	"/locations": ["title"],
	"/persons": ["title", "description", "text", "image"],
	"/downloads": ["title", "description", "file"],
	"/forms": ["title"],
	"/images": ["title", "description"],
	"/news": ["title", "date"],
	"/categories": ["title"]
};

export default default_fields;
