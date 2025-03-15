import { UserTypes } from ".";
import { TaskTypes, TicketTypes } from "../content";

export type MessageTypes =
  | "task_created"
  | "ticket_created"
  | "task_assigned"
  | "task_completed"
  | "task_deleted"
  | "ticket_closed"
  | "ticket_response"
  | "ticket_deleted"
  | "task_response"
  | "task_comment"
  | "ticket_comment"
  | "task_updated"
  | "ticket_updated";

export type Message = {
  objectId: string;
  createdAt: string;
  type: MessageTypes;
  task?: TaskTypes.Task;
  ticket?: TicketTypes.Ticket;
  is_read: boolean;
  created_by: UserTypes.UserDisplayData;
};

export type MessageUpdateObject = Partial<Message, "task" | "type" | "is_read">;
