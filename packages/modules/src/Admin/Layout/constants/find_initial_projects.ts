import { gql } from '@apollo/client';

const find_initial_projects = gql` 
    query findProjects {
    	objects {
			findProject {
				results {
					name
					objectId
					content
					logo 
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
	}
`;

export default find_initial_projects;