import { ModuleFieldIds, Module } from "@repo/types";

const default_fields: {
	[key in Module["path"]]: ModuleFieldIds[];
} = {
	"/arcticles": ["title", "text", "image", "date"],
	"/events": ["title", "description", "dates"],
	"/groups": ["title", "description", "text", "image", "date", "gallery"],
	"/locations": ["title"],
	"/persons": ["title", "description", "text", "image", "date", "gallery"],
	"/downloads": ["title", "description", "file"],
	"/forms": [],
	"/images": ["title", "description", "file"],
	"/news": ["title", "date"],
	"/categories": []
};

export default default_fields;
