import { Module } from "@repo/types";

const generateQueryFromFields = (fields: Module["fields"]) => {
	const staticFields = ["objectId", "createdAt", "updatedAt", "categories"];

	fields.forEach((field) => {
		if (field.active) {
			staticFields.push(field.id);
		}
	});
	console.log({ staticFields });
	return staticFields;
};

export default generateQueryFromFields;
