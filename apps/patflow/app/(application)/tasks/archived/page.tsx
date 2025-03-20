import { Tasks } from "@repo/ui";
import { Suspense } from "react";

const TasksPage = () => (
  <Suspense>
    <Tasks pageState="archived" />
  </Suspense>
);

export default TasksPage;
