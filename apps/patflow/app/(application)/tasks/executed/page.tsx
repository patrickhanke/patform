import { Tasks } from "@repo/ui";
import { Suspense } from "react";

const TasksPage = () => (
  <Suspense>
    <Tasks pageState="executed" />
  </Suspense>
);

export default TasksPage;
