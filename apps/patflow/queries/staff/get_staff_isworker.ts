import { gql } from '@apollo/client';

const get_staff_isworker  = gql`
    query getWorkerIsWorker($id: ID!) {
        objects {
            get_User (objectId: $id) {
                objectId
                is_worker
            }
        }
    }
`;

export default get_staff_isworker;