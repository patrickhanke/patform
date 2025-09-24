import { gql } from "@apollo/client";

const find_absence = gql`
  query findAbsencesForUser($params: AbsenceConstraints) {
    objects {
      findAbsence(where: $params) {
        results {
          objectId
          start_date
          end_date
          state
          comment
          type
          year
          user {
            objectId
            username
            first_name
            last_name
            email
            color
            portrait
          }
          created_by {
            objectId
            username
            first_name
            last_name
            email
            portrait
          }
        }
      }
    }
  }
`;

export default find_absence;
