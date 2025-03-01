import { gql } from '@apollo/client';

export const find_initial_projects = gql` 
    query findProjects {
    	objects {
			findProject {
				results {
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
	}
`;
