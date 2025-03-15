import { Tasks } from "@content";
import { Suspense } from "react";

const TasksPage = () => (
  <Suspense>
    <Tasks pageState="completed" />
  </Suspense>
);

export default TasksPage;
