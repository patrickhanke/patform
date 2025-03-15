import { gql } from "@apollo/client";

const find_all_roles = gql`
  query findAllRoles {
    objects {
      find_Role(order: name_DESC) {
        results {
          objectId
          name
          type
          color
          users {
            results {
              objectId
              username
            }
          }
        }
      }
    }
  }
`;

export default find_all_roles;
