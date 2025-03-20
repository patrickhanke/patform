import { gql } from "@apollo/client";

const find_records_for_user = gql`
  query findRecord($user: _UserPointer) {
    objects {
      findRecord(where: { user: { _eq: $user } }) {
        results {
          user {
            objectId
            first_name
            family_name
            settings
          }
          objectId
          createdAt
          year
          default_times
          absence
          settings
          working_days
          start_date
          end_date
          time_settings
          absence_days
          saldo
          initial_vacation
          initial_saldo
          holiday_template {
            objectId
            name
            holidays
          }
        }
      }
    }
  }
`;

export default find_records_for_user;
