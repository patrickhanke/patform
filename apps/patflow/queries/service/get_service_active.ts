import { gql } from '@apollo/client';

const get_object_service_time  = gql`
    query getObjectServiceTime($id: ID!) {
        objects {
            getService (objectId: $id) {
                objectId
                active
            }
        }
    }
`;

export default get_object_service_time;