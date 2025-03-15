import { gql } from "@apollo/client";

const FIND_ALL_TASKS = gql`
  query findAllTasks($params: TaskConstraints) {
    objects {
      findTask(where: $params) {
        results {
          objectId
          title
          state
          time
          assigned_staff
          dates
          executed_at
        }
      }
    }
  }
`;

export default FIND_ALL_TASKS;
