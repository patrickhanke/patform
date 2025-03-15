import { ApolloRefetch, Task } from "@types";
import { ReactNode } from "react";

export type TeamAssignmentProps = {
  taskId: string;
  taskState: Task["state"];
  refetchTask: ApolloRefetch;
  showAsButton?: boolean;
};

export type DisplayWorkerProps = {
  taskId: string;
  refetchTask: ApolloRefetch;
  taskState: Task["state"];
  showAsButton?: boolean;
  selectWorkers?: boolean;
};

export type WorkerOption = {
  value: string;
  id: string;
  label: string;
  element: ReactNode;
};
