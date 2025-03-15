import { gql } from '@apollo/client';

const get_service_time = gql`
    query getServiceTime($id: ID!) {
        objects {
            getService(objectId: $id) {
                objectId
                time
            }
        }
    }
`;

export default get_service_time;
