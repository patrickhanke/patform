import { gql } from '@apollo/client';
import { generateGraphQLQueryProps } from '../types';

const generateGraphQLQuery: generateGraphQLQueryProps = ({
	type, 
	objectName, 
	fields
}) => {
	const fieldsString = fields?.join('\n');

    console.log(fields);
    

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
	} else if (type === 'get') {
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