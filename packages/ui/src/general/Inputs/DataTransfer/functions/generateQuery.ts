import { gql } from "@apollo/client";
import { GenerateQuery } from "../types";

const generateQuery: GenerateQuery = ({ objectName, fields }) => {
	const fieldsString = fields?.join("\n");

	return gql` 
        query find${objectName}($params: ${objectName}Constraints ) {
            objects {
                find${objectName}(where: $params ) {
                    results {
                        ${fieldsString}
                    }
                }
            }
        }    
    `;
};

export default generateQuery;
