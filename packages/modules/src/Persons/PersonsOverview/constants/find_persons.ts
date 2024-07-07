import {gql}  from '@apollo/client';

const find_persons = gql`
    query find_persons($params: PersonConstraints) {
        objects {
            findPerson(where: $params) {
                results {
                    createdAt
                    objectId
                    name
                }
            }
        }
    }
`;

export default find_persons