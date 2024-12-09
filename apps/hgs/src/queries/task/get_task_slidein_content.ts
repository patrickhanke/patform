import { gql } from '@apollo/client';

const get_task_slidein_content  = gql`
    query getTaskObject($id: ID!) {
        objects {
            getTask(objectId: $id) {
                objectId
                comments
                images
                ticket {
                    objectId
                    title
                    state
                }
            }
        }
    }
`;

export default get_task_slidein_content;