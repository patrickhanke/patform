import { CreateTask, Task } from "@types";
import { ReactNode, SetStateAction } from "react";

export type SelectTicketProps = {
  projectId: string;
  setTask: Dispatch<SetStateAction<CreateTask>>;
  task: CreateTask;
  showTicketOnly?: boolean;
};

export type SelectPropertyProps = {
  setTask: Dispatch<SetStateAction<CreateTask>>;
  task: CreateTask;
  showPropertyOnly?: boolean;
};

export type SelectWorkerProps = {
  setTask: Dispatch<SetStateAction<CreateTask>>;
  task: CreateTask;
  propertyId?: string;
};

export type TicketOption = {
  value: string;
  id: string;
  label: string;
  header: string;
  description: string;
  element: ReactNode;
};

export type PropertyOptions = {
  value: string;
  id: string;
  label: string;
  element: ReactNode;
};
