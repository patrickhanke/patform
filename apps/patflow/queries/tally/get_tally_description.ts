import { gql } from "@apollo/client";

const get_tally_description = gql`
  query GetTallyDescription($id: ID!) {
    objects {
      getTally(objectId: $id) {
        objectId
        description
      }
    }
  }
`;

export default get_tally_description;
