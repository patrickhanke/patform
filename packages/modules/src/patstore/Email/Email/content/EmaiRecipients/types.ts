import { EmailClass } from "@repo/types";

export interface EmailRecipientsProps {
	email: EmailClass;
}

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
