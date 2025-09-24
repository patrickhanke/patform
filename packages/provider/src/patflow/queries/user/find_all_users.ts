import { gql } from "@apollo/client";

const find_all_users = gql`
  query findAllUsers {
    objects {
      find_User(order: last_name_ASC) {
        results {
          objectId
          first_name
          last_name
          is_worker
          portrait
          role {
            objectId
            name
            type
            color
          }
          createdAt
        }
      }
    }
  }
`;

export default find_all_users;
