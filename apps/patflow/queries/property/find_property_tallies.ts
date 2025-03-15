import { gql } from "@apollo/client";

const find_property_tallies = gql`
  query findPropertyTallies($id: PropertyPointer) {
    objects(where: { property: { _eq: $id } }) {
      findTally {
        results {
          objectId
          name
          description
          entries
        }
      }
    }
  }
`;

export default find_property_tallies;
