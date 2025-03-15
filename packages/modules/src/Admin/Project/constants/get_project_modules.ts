import { gql } from "@apollo/client";

const get_project_modules = gql`
  query getProjects($id: ID!) {
    objects {
      getProject(objectId: $id) {
        name
        objectId
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

export default get_project_modules;
