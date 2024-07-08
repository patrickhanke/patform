import {gql}  from '@apollo/client';

const get_person = gql`
    query getPerson($id: ID!) {
        objects {
            getPerson(objectId: $id) {
                results {
                    createdAt
                    objectId
                    name
                }
            }
        }
    }
`;

export default get_person