import { EmailClass } from "@repo/types";
import { EmailRecipient } from "../../types";

export type { EmailRecipient, EmailRescipientResponse } from "../../types";

export interface EmailOverviewProps {
	email: EmailClass;
	recipients: EmailRecipient[];
	suppressedRecipients: EmailRecipient[];
}

export interface RecipientCountProps {
	email: EmailClass;
	recipients: EmailRecipient[];
	suppressedRecipients: EmailRecipient[];
}
