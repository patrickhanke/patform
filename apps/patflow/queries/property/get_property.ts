import { gql } from "@apollo/client";

const get_property = gql`
  query getPropertyById($id: ID!) {
    objects {
      getProperty(objectId: $id) {
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
`;

export default get_property;
