import { gql } from "@apollo/client";

const get_project = gql` 
    query getProjects($id: ID!) {
    	objects {
			findModule(where: {project: {_eq: $id}}) {
				results {
					objectId
					name
					path
					icon
					settings
					fields
					categories
					connected_class
				}
			}
			getProject(objectId: $id) {
				name
				objectId
				content
				logo {
					name
					url
				}
				modules {
					results {
						objectId
						name
						path
						icon
						settings
						fields
						categories
						connected_class
					}
				}
			}
		}
	}
`;

export default get_project;