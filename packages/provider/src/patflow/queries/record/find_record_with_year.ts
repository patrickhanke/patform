import { gql } from "@apollo/client";

const find_record = gql`
  query findRecord($year: Float) {
    objects {
      findRecord(where: { year: { _eq: $year } }) {
        results {
          user {
            objectId
            first_name
            family_name
            settings
          }
          objectId
          year
          start_date
          end_date
        }
      }
    }
  }
`;

export default find_record;
