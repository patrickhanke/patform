import {
  DateObject,
  DateTypes,
  Document,
  TDateISO,
  UserTypes,
} from "@repo/types";
import { PropertyTypes } from "../Property";

export type TaskState =
  | "completed"
  | "executed"
  | "created"
  | "assigned"
  | "archived";

export type Task = {
  objectId: string;
  title: string;
  comments: Comment[];
  description: string;
  documents: Document[];
  state: TaskState;
  object: PropertyTypes.Property;
  time: DateObject;
  ticket?: TicketTypes.Ticket;
  assigned_staff: string[];
  dates: string[];
  images: string[];
  executed_at?: TDateISO;
  category: "fixed" | "opportunity";
};

export type Comment = {
  user: UserTypes.UserDisplayData;
  createdAt: DateTypes.TDateISO;
  text: string;
  objectId: string;
  username: string;
};

export type TaskComponent = {
  task: TaskTypes.Task;
  deleteTask: (id: TaskTypes.Task["objectId"]) => void;
  showDivider: boolean;
  tasksRefetch: () => void;
};
