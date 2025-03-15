import { gql } from '@apollo/client';

const find_object_documents = gql`
    query findPropertyDocument($params: DocumentConstraints) {
        objects {
            findDocument(where: $params, order: createdAt_DESC) {
                results {
                    createdAt
                    objectId
                    name
                    type
                    created_by {
                        objectId
                        first_name
                        family_name
                    }
                    property {
                        objectId
                        name
                    }
                    task {
                        objectId
                        title
                    }
                    file {
                        name
                        url
                    }
                }
            }
        }
    }
`;

export default find_object_documents;
