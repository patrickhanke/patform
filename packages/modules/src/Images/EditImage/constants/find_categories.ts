import {gql}  from '@apollo/client';

const find_categories = gql`
    query find_categories($module: ModulePointer, $type: String) {
        objects {
            findCategory(where: {module:{_eq: $module}, type: {_eq: $type}}) {
                results {
                    createdAt
                    objectId
                    name
                    type
                }
            }
        }
    }
`;

export default find_categories;