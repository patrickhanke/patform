import { ClassProperties } from "./Classes";

export type EmailRecipient = {
  name: string;
  email: string;
};

export type EmailClass = ClassProperties & {
  title: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  attachments: string[];
  recipients: EmailRecipient[];
  createdAt: string;
  updatedAt: string;
  state?: "draft" | "sent";
  date?: string;
  settings: {
    unsubscribe_link: boolean;
    unsubscribe_url?: string;
    email_subject?: string;
    recipient_list?: string;
  };
};
