import { Tasks } from "@repo/modules";
import { Suspense } from "react";

const TasksPage = () => (
  <Suspense>
    <Tasks pageState="executed" />
  </Suspense>
);

export default TasksPage;
