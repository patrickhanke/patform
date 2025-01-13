import { gql } from '@apollo/client';
import { GenerateGraphQLQuery } from '../types';

const generateGraphQLQuery: GenerateGraphQLQuery = ({
	type, 
	objectName, 
	fields
}) => {
	const fieldsString = fields?.join('\n');

	if (type === 'find' ) {
		return gql`
            query ${type}${objectName}($params: ${objectName}Constraints ) {
                objects {
                    ${type}${objectName}(where: $params ) {
                        results {
                            ${fieldsString}
                        }
                    }
                }
            }
        `;
	} else {
		return gql`
            query ${type}${objectName}($id: ID!) {
                objects {
                    ${type}${objectName}(objectId: $id) {
                        ${fieldsString}
                    }
                }
            }
        `;
	}
};

export default generateGraphQLQuery;