import { gql } from "@apollo/client";

const find_all_property = gql`
  query findAllProperties {
    objects {
      findProperty(order: name_ASC) {
        results {
          objectId
          name
          createdAt
          created_by {
            objectId
            username
          }
        }
      }
    }
  }
`;

export default find_all_property;
