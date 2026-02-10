import { gql } from "@apollo/client";
import { GenerateGraphQLQueryFunction } from "../types";

const stringreplace = (str: string) => {
	return str.replace(
		new RegExp("author", "g"),
		"author {objectId label portrait}"
	);
	// .replace(new RegExp("file", "g"), "file {name url}");
};

const getQueryStringFromFields = (fields: string[]) => {
	return fields
		.map((field) => {
			if (
				field === "categories" ||
				field === "field" ||
				field === "fields" ||
				field === "data_fields" ||
				field === "setting_fields" ||
				field === "roles" ||
				field === "gallery" ||
				field === "persons" ||
				field === "times" ||
				field === "dates" ||
				field === "documents" ||
				field === "connected_elements" ||
				field === "content" ||
				field === "attachments" ||
				field === "recipients" ||
				field === "lists" ||
				field === "emails" ||
				field === "projects" ||
				field === "assigned_staff" ||
				field === "comments" ||
				field === "images" ||
				field === "surcharges" ||
				field === "day_value" ||
				field === "default_times" ||
				field === "holidays"
			) {
				return `
                ${field} {
                    ... on Element {
                        value
                    }
                }
            `;
			}
			return field;
		})
		.join("\n");
};

const generateGraphQLQuery_4_1: GenerateGraphQLQueryFunction = ({
	type,
	objectName,
	queryName,
	fields
}) => {
	const fieldsString = getQueryStringFromFields(fields || []);

	const processedFields = stringreplace(fieldsString);

	if (type === "find") {
		return gql`
            query ${type}${objectName}($params: ${objectName}WhereInput, $first: Int, $skip: Int, $order: [${objectName}Order!]) {
                ${queryName}(where: $params, first: $first, skip: $skip, order: $order) {
					count
                    edges {
                        node {
                            ${processedFields}
                        }
                    }
                }
            }
        `;
	} else if (type === "get") {
		return gql`
            query get${objectName}($id: ID!) {
                ${queryName}(id: $id) {
                    ${fieldsString}
                }
            }
        `;
	} else return undefined;
};

export default generateGraphQLQuery_4_1;
