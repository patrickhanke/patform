"use client";

import { TaskPageState, Tasks } from "@repo/ui";
import React, { Suspense } from "react";

const TasksOverview = ({ pageState }: { pageState: TaskPageState }) => {
  return (
    <Suspense>
      <Tasks pageState={pageState} />
    </Suspense>
  );
};

export default TasksOverview;
