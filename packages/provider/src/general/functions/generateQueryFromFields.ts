import { Module } from "@repo/types";

const generateQueryFromFields = (fields: Module["fields"]) => {
	const staticFields = ["objectId", "createdAt", "updatedAt", "categories"];

	fields.forEach((field) => {
		if (field.active) {
			if (field.type === "file") {
				staticFields.push("file {name url}");
			} else {
				staticFields.push(field.id);
			}
		}
	});

	return staticFields;
};

export default generateQueryFromFields;
