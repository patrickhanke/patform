import { EmailStatus } from "@repo/types";

export interface EmailRecipientsProps {
	emailTemplateId: string;
}

export type TableData = {
	last_name: string;
	first_name: string;
	title: string;
	email: string;
	suppressed: boolean;
	state?: EmailStatus;
	sendAt?: string;
};
