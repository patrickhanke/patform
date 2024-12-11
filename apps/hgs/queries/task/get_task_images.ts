import { gql } from '@apollo/client';

const get_task_time  = gql`
    query getTaskTime($id: ID!) {
        objects {
            getTask(objectId: $id) {
                objectId
                images
            }
        }
    }
`;

export default get_task_time;