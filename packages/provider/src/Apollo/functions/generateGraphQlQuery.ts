import { gql } from '@apollo/client';
import { generateGraphQLQueryProps } from '../types';

const stringreplace = (str: string, find?: string, replace?: string) => {
	const letStringCopy = str;
    
	letStringCopy.replace(new RegExp('logo', 'g'), 'logo {name url}');
	letStringCopy.replace(new RegExp('author', 'g'), 'author {objectId label portrait}');
	return letStringCopy;
};

const generateGraphQLQuery: generateGraphQLQueryProps = ({
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
                            ${stringreplace(fieldsString)}
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