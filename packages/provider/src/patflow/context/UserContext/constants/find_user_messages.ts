import { gql } from "@apollo/client";

const find_user_messages = gql`
  query findUserMessages($params: MessageConstraints) {
    objects {
      findMessage(where: $params, order: createdAt_DESC) {
        results {
          objectId
          createdAt
          type
          is_read
          created_by {
            objectId
            first_name
            last_name
            email
          }
          task {
            objectId
            title
          }
          ticket {
            objectId
          }
          content
        }
      }
    }
  }
`;

export default find_user_messages;
