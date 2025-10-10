import { gql } from "@apollo/client";
import { GenerateGraphQLQueryFunction } from "../types";

const stringreplace = (str: string) => {
	const letStringCopy = str;

	letStringCopy.replace(
		new RegExp("author", "g"),
		"author {objectId label portrait}"
	);
	// .replace(new RegExp("file", "g"), "file {name url}");

	return letStringCopy;
};

const generateGraphQLQuery: GenerateGraphQLQueryFunction = ({
	type,
	objectName,
	fields
}) => {
	const fieldsString = fields?.join("\n");

	if (type === "find") {
		return gql`
            query ${type}${objectName}($params: ${objectName}Constraints, $limit: Int, $skip: Int, $order: [${objectName}Order!]  ) {
                objects {
                    ${type}${objectName}(where: $params, limit: $limit, skip: $skip, order: $order) {
                        count
                        results {
                            ${stringreplace(fieldsString)}
                        }
                    }
                }
            }
        `;
	} else if (type === "get") {
		return gql`
            query ${type}${objectName}($id: ID!) {
                objects {
                    ${type}${objectName}(objectId: $id) {
                        ${fieldsString}
                    }
                }
            }
        `;
	} else return undefined;
};

export default generateGraphQLQuery;
