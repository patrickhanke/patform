import {gql}  from '@apollo/client';

export const find_images = gql`
    query find_images($params: ImageConstraints) {
        objects {
            findImage(where: $params) {
                results {
                    objectId
                    name
                    description
                    filePath
                    person
                }
            }
        }
    }
`;