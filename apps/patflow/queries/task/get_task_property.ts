import { gql } from '@apollo/client';

const get_task_property = gql`
    query getTaskProperty($id: ID!) {
        objects {
            getTask(objectId: $id) {
                objectId
                property {
                    objectId
                    name
                }
            }
        }
    }
`;

export default get_task_property;
