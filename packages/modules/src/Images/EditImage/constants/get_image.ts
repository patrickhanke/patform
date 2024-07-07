import {gql}  from '@apollo/client';

const get_image = gql`
    query getImage($id: ID!) {
        objects {
            getImage(objectId: $id) {
                createdAt
                objectId
                name
                description
                filePath
                person
            }
        }
    }
`;

export default get_image;