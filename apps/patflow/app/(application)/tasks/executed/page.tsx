import { Tasks } from "@repo/modules";
import { Suspense } from "react";

const TasksPage = () => (
  <Suspense>
    <Tasks key="executed" pageState="executed" />
  </Suspense>
);

export default TasksPage;
