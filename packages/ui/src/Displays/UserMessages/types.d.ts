import { MessageTypes } from "@/types/General";
import { Notification, NotificationData } from "@repo/types";

export type MessageContent = {
  objectId: MessageTypes.Message["objectId"];
  type: MessageTypes.MessageTypes;
  createdAt: MessageTypes.Message["createdAt"];
  headline: string;
  content: string;
  link: string;
  time: string;
  is_read: MessageTypes.Message["is_read"];
  data: NotificationData;
};

export type UserMessagesProps = {
  notifications: Notification[];
  setNotificationsToRead: () => void;
  deleteNotification: (id: number | string) => void;
};

export type RenderNotificationProps = Notification & {
  deleteNotification: (id: number | string) => void;
};

export type NotificationStateDisplay = {
  label: "Ticket" | "Task" | "Urlaub" | "";
  color: "blue" | "green" | "yellow" | "";
  icon: "ticket" | "task" | "clock";
  link: string | null;
};
