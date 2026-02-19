import { Tasks } from "@repo/modules";
import { Suspense } from "react";

const TasksPage = () => (
  <Suspense>
    <Tasks key="completed" pageState="completed" />
  </Suspense>
);

export default TasksPage;
