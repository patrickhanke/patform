import { ClassProperties } from "./Classes";

export type EmailStatus =
	| "sent"
	| "delivered"
	| "opened"
	| "clicked"
	| "bounced"
	| "complained"
	| "unsubscribed"
	| "failed"
	| "pending"
	| "unknown";

export type EmailRecipient = {
  email: string;
    userId: string,
    unsubscribeLink?: string,
    listName?: string,
    data: {
      label: string,
      first_name: string,
      last_name: string,
      title: string,
      pre_title: string,
      name: string
    },
    message_id?: string,
    status?: EmailStatus,
    delivered_at?: string

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
