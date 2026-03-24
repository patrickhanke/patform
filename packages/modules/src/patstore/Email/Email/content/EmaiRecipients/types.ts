import { EmailClass, EmailStatus } from "@repo/types";
import { EmailRecipient } from "../../types";

export interface EmailRecipientsProps {
	email: EmailClass;
	recipients: EmailRecipient[];
	emailRecipients: EmailClass["recipients"];
}

export type TableData = {
	last_name: string;
	first_name: string;
	title: string;
	email: string;
	suppressed: boolean;
	status?: EmailStatus;
};
