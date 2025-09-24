import { gql } from "@apollo/client";

const GET_USER = gql`
	query getUser($id: ID!) {
		objects {
			get_User(objectId: $id) {
				objectId
				username
				email
				portrait
				first_name
				last_name
				time_settings
			}
		}
	}
`;

export default GET_USER;
