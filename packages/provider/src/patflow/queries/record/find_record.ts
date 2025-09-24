import { gql } from "@apollo/client";

const find_record = gql`
	query findRecord($params: RecordConstraints) {
		objects {
			findRecord(where: $params) {
				results {
					user {
						objectId
						first_name
						last_name
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

export default find_record;
