import { gql } from '@apollo/client';

const FIND_ALL_TICKETS  = gql`
    query findAllTickets($params: TicketConstraints ) {
        objects {
            findTicket(where: $params, order: createdAt_DESC) {
                results {
                    objectId
                    id: objectId
                    createdAt
                    state
                    title
                    description
                    images
                    property {
                        objectId
                        id: objectId
                        name
                    }
                    created_by {
                        objectId
                        id: objectId
                    }
                    task {
                        objectId
                        id: objectId
                        title                
                    }
                }
            }
        }
    }
`;

export default FIND_ALL_TICKETS;