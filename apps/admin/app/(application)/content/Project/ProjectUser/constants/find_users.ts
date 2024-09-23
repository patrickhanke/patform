import { gql } from '@apollo/client';

const find_users = gql` 
    query findUsers($project: ProjectPointer) {
    	objects {
			find_User(where: {project: $project}) {
                name
                objectId
                email
                username
			}
		}
	}
`;

export default find_users;