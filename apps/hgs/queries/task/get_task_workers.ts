import { gql } from '@apollo/client';

const get_task_workers  = gql`
    query getTaskWorkers($id: ID!) {
        objects {
            getTask(objectId: $id) {
                objectId
                assigned_staff
                dates
                time
                title
            }
        }   
    }
`;

export default get_task_workers;