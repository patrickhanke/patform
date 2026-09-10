import { ContentBlock } from "@repo/ui";
import { Filter } from "../general";
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
	label: string;
	first_name: string;
	last_name: string;
	title: string;
	pre_title: string;
	name: string;
	email: string;
	objectId: string;
};

export type EmailTemplate = ClassProperties & {
	title: string;
	type: "template";
	state?: "draft" | "sent";
	data: {
		from: string;
		to: string;
		subject: string;
		body: string;
	};
	attachments: string[];

	content: ContentBlock[];
	sendAt?: string;
	createdAt: string;
	updatedAt: string;
	settings: {
		attachments?: string[];
		subject?: string;
		recipient_list?: string;
	};
};

export type EmailList = ClassProperties & {
	objectId: string;
	title: string;
	createdAt: string;
	updatedAt: string;
	type: "list" | "static_list";
	settings: {
		unsubscribe: boolean;
		unsubscribe_link: string;
		static_list: boolean;
		include_all_users: boolean;
		filters: Filter[];
		recipients: string[];
	};
};

export type Email = ClassProperties & {
	reference_id: string;
	message_id: string;
	type: "email";
	title: string;
	state: EmailStatus;
	sendAt?: string;
	data: {
		from: string;
		to: {
			email: string;
			name: string;
		};
		subject: string;
		content: string;
		attachments: string[];
		recipient: EmailRecipient;
		unsubscribeLink: string;
		listName: string;
		metadata: object;
		tag: string;
	};
};

export type EmailClass = EmailList | EmailTemplate | Email;
