import { Tasks } from "@repo/modules";
import { Suspense } from "react";

const TasksPage = () => (
  <Suspense>
    <Tasks key="archived" pageState="archived" />
  </Suspense>
);

export default TasksPage;
