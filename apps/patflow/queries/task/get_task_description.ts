import { gql } from '@apollo/client';

const get_task_description = gql`
    query getTaskDescription($id: ID!) {
        objects {
            getTask(objectId: $id) {
                objectId
                description
            }
        }
    }
`;

export default get_task_description;
