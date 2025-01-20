import { gql } from '@apollo/client';

const get_task_time  = gql`
    query getTaskTime($id: ID!) {
        objects {
            getTask(objectId: $id) {
                objectId
                title
                time
                category
                type
                dates
                state
            }
        }
    }
`;

export default get_task_time;