import { gql } from '@apollo/client';

const find_property_services = gql`
    query findPropertyServices($id: PropertyPointer) {
        objects {
            findService(where: { property: { _eq: $id } }) {
                results {
                    objectId
                    name
                    property {
                        objectId
                        name
                    }
                    worker {
                        results {
                            objectId
                            username
                        }
                    }
                    time
                }
            }
        }
    }
`;

export default find_property_services;
