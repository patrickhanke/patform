import { gql } from "@apollo/client";

const get_task_slidein_content = gql`
	query getTaskObject($id: ID!) {
		objects {
			getTask(objectId: $id) {
				objectId
				comments
				images
				state
				executed_at
				ticket {
					objectId
					createdAt
					title
					state
					description
					images
					created_by {
						objectId
						username
					}
				}
			}
		}
	}
`;

export default get_task_slidein_content;
