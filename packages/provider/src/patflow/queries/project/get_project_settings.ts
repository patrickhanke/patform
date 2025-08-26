import { gql } from "@apollo/client";

const get_project_settings = gql`
	query getObjectServiceTime($id: ID!) {
		objects {
			getProject(objectId: $id) {
				objectId
				time_settings
				record_settings
			}
		}
	}
`;

export default get_project_settings;
