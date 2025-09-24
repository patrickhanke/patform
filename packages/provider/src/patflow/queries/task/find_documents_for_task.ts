import { gql } from "@apollo/client";

const find_documents_for_task = gql`
  query findDocumentsForTask($id: TaskPointer!) {
    objects {
      findDocument(where: { task: { _eq: $id } }, order: createdAt_DESC) {
        results {
          objectId
          createdAt
          name
          created_by {
            objectId
            first_name
            last_name
            portrait
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

export default find_documents_for_task;
