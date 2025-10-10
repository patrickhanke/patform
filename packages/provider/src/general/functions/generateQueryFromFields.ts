import { Module } from "@repo/types";

const generateQueryFromFields = (fields: Module["fields"]) => {
	const staticFields = ["objectId", "createdAt", "updatedAt"];

	fields.forEach((field) => {
		if (field.active) {
			staticFields.push(field.id);
		}
	});
	console.log({ staticFields });
	return staticFields;
};

export default generateQueryFromFields;
