import { gql } from "@apollo/client";

const get_task = gql`
  query getTask($id: ID!) {
    objects {
      getTask(objectId: $id) {
        objectId
        state
        time
      }
    }
  }
`;

export default get_task;
