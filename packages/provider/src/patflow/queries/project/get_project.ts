import { gql } from "@apollo/client";

const get_project = gql`
	query getProject($id: ID!) {
		objects {
			getProject(objectId: $id) {
				objectId
				name
				time_settings
				data
			}
		}
	}
`;

export default get_project;
