import { gql } from "@apollo/client";

function generateGraphQLQuery(objectName, fields) {
	// const constraintsString = Object.entries(constraints)
	// 	.map(([key, value]) => `${key}: { equalTo: "${value}" }`)
	// 	.join(', ');
  
	const fieldsString = fields.join('\n');
  
	return gql`
      query ${objectName}($id: ID!) {
        objects {
            ${objectName}(objectId: $id) {
                ${fieldsString}
            }
        }
      }
    `;
}

export default generateGraphQLQuery;