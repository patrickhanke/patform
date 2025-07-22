import { gql } from "@apollo/client";

const get_project_settings = gql`
	query getProjects($id: ID!) {
		objects {
			getProject(objectId: $id) {
				name
				objectId
				logo
				settings
			}
		}
	}
`;

export default get_project_settings;
