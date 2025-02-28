import { gql } from '@apollo/client';

const find_users = gql` 
    query findUsers($project: ProjectPointer) {
    	objects {
			find_User(where: {project: {_eq: $project}}) {
                results {
                    objectId
                    email
                    username
                }
			}
		}
	}
`;

export default find_users;