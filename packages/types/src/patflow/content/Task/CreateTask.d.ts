import { DateTypes } from "@/types/General";
import { Comment, Document, Task, TaskState } from "./Task";
import { PropertySelect } from "../Property/Property";
import { Dispatch, SetStateAction } from "react";

export type TaskInitialData = Partial<
  Pick<
    Task,
    "title" | "description" | "documents" | "state" | "time" | "ticket"
  >
>;

export type CreateTaskUpdateObject = {
  title: string;
  description: string;
  documents: Document[];
  created_by: { __type: "Pointer"; className: "_User"; objectId: string };
  state: TaskState;
  time: DateTypes.DateObject | null;
  comments: Comment[];
  assigned_staff: string[];
  ticket?: { __type: "Pointer"; className: "Ticket"; objectId: string };
  property?: { __type: "Pointer"; className: "Property"; objectId: string };
  project?: { __type: "Pointer"; className: "Project"; objectId: string };
  type: string;
  category: string;
  dates: string[] | undefined;
  images: string[];
  is_service?: boolean;
};

export type CreateTaskProps = {
  button?: React.FC<{ onClick: () => void }>;
  isService?: boolean;
  initialData?: {
    assigned_staff?: [string];
    ticket?: string;
    property?: string;
  };
};

export type CreateTask = Pick<
  Task,
  | "title"
  | "description"
  | "documents"
  | "state"
  | "ticket"
  | "assigned_staff"
  | "images"
  | "is_service"
> & { property?: PropertyTypes.PropertySelect | undefined } & {
  properties?: string[];
  time: DateObject | undefined;
};
