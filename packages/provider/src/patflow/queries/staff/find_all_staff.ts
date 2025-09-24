import { gql } from "@apollo/client";

const find_all_staff = gql`
	query findAllWorkers {
		objects {
			find_User(
				order: last_name_DESC
				where: { is_worker: { _eq: true } }
			) {
				results {
					objectId
					first_name
					last_name
					is_worker
					portrait
					color
					time_settings
					number
					data
					role {
						objectId
						name
						type
						color
					}
					createdAt
				}
			}
		}
	}
`;

export default find_all_staff;
