import { GET_TASK_STATE } from "@queries";
import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import styles from "./DisplayTaskState.module.scss";
import { TaskState } from "@repo/types";
import { Loader, StateSelect } from "@repo/ui";
import { task_state_options } from "@repo/provider";

const DisplayTaskState = ({
  taskId,
  taskState,
}: {
  taskId: string;
  taskState: TaskState;
}) => {
  const [state, setState] = useState<TaskState>(taskState);
  const { data } = useQuery(GET_TASK_STATE, {
    variables: { id: taskId },
    skip: !!taskState,
  });

  useEffect(() => {
    if (taskState) {
      setState(taskState);
    }

    if (data && !taskState) {
      setState(data.objects.getTask.state);
    }
  }, [data, taskState]);

  if (state)
    return (
      <div className={styles.task_state_container}>
        <StateSelect
          type="state"
          state={state}
          stateOptions={task_state_options}
          icon="clock"
        />
      </div>
    );

  return <Loader width="30px" height="18px" />;
};

export default DisplayTaskState;
