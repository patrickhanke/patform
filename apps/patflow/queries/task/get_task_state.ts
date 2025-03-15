import { gql } from '@apollo/client';

const get_task_state = gql`
    query getTaskState($id: ID!) {
        objects {
            getTask(objectId: $id) {
                objectId
                state
            }
        }
    }
`;

export default get_task_state;
