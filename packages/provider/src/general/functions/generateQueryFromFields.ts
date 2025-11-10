import { Module } from "@repo/types";

const generateQueryFromFields = (fields: Module["fields"]) => {
	const staticFields = ["objectId", "createdAt", "updatedAt", "categories"];

	fields.forEach((field) => {
		if (field.active) {
			if (field.type === "file" || field.type === "image_preview") {
				staticFields.push("file {name url}");
			} else if (field.id === "created_by") {
				staticFields.push(
					"created_by {objectId label name portrait {name url}}"
				);
			} else if (field.id === "updated_by") {
				staticFields.push(
					"updated_by {objectId label name portrait {name url}}"
				);
			} else {
				staticFields.push(field.id);
			}
		}
	});

	return staticFields;
};

export default generateQueryFromFields;
