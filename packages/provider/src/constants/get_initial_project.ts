import { gql } from "@apollo/client";

const get_initial_project = gql`
  query getProjects($id: ID!) {
    objects {
      getProject(objectId: $id) {
        name
        objectId
        content
        logo
        modules {
          results {
            objectId
            name
            path
            icon
            settings
            fields
            categories
            connected_class
          }
        }
      }
    }
  }
`;

export default get_initial_project;
