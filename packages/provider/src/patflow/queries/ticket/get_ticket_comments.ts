import { gql } from "@apollo/client";

const get_ticket_comments = gql`
  query getTicket($id: ID!) {
    objects {
      getTicket(objectId: $id) {
        objectId
        comments
      }
    }
  }
`;

export default get_ticket_comments;
