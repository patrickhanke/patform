import { gql } from "@apollo/client";

const get_user_display_data = gql`
  query getUSerDisplayData($id: ID!) {
    objects {
      get_User(objectId: $id) {
        objectId
        username
        email
        portrait
        first_name
        last_name
        color
        role {
          objectId
          name
        }
      }
    }
  }
`;

export default get_user_display_data;
