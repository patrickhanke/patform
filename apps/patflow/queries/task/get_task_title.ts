import { gql } from "@apollo/client";

const get_task_title = gql`
  query getTaskTitle($id: ID!) {
    objects {
      getTask(objectId: $id) {
        objectId
        title
      }
    }
  }
`;

export default get_task_title;
