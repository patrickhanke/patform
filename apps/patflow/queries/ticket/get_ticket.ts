import { gql } from '@apollo/client';

const GET_TICKET = gql`
    query getTicket($id: ID!) {
        objects {
            getTicket(objectId: $id) {
                objectId
                createdAt
                title
                description
                state
                images
                task {
                    objectId
                    title
                    state
                }
                created_by {
                    objectId
                    username
                }
                property {
                    objectId
                    name
                }
            }
        }
    }
`;

export default GET_TICKET;
