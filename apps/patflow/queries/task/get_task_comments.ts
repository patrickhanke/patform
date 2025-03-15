import { gql } from '@apollo/client';

const get_task_comments = gql`
    query getTaskComments($id: ID!) {
        objects {
            getTask(objectId: $id) {
                objectId
                comments
            }
        }
    }
`;

export default get_task_comments;
