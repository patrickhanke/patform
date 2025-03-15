import { gql } from "@apollo/client";

const get_initial_user = gql`
  query getInitialUser($id: ID!) {
    objects {
      get_User(objectId: $id) {
        objectId
        username
        email
        portrait
        first_name
        family_name
        time_settings
        projects
      }
    }
  }
`;

export default get_initial_user;
