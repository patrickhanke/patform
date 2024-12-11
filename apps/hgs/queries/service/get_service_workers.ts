import { gql } from '@apollo/client';

const get_object_service_workers  = gql`
    query getObjectServiceWorkers($id: ID!) {
        objects {
            getService (objectId: $id) {
                objectId
                workers {
                    results {
                        objectId
                        first_name
                        family_name
                        portrait
                    }
                }
            }
        }
    }
`;

export default get_object_service_workers;