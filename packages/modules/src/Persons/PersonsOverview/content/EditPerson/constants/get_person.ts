import {gql}  from '@apollo/client';

const get_person = gql`
    query getPerson($id: ID!) {
        objects {
            getPerson(objectId: $id) {
                createdAt
                objectId
                name
                age
                description
            }
        }
    }
`;

export default get_person