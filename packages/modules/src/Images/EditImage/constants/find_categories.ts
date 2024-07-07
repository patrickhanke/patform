import {gql}  from '@apollo/client';

const find_categories = gql`
    query find_categories($project: ProjectPointer, $type: String) {
        objects {
            findCategory(where: {project:{_eq: $project}, type: {_eq: $type}}) {
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