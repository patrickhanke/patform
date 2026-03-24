import { EmailClass } from "@repo/types";

export type { EmailRecipient, EmailRescipientResponse } from "../../types";

export interface EmailOverviewProps {
	email: EmailClass;
	recipients: EmailRecipient[];
	suppressedRecipients: EmailRecipient[];
	findRecipients: () => void;
}

export interface RecipientCountProps {
	email: EmailClass;
	recipients: EmailRecipient[];
	suppressedRecipients: EmailRecipient[];
	findRecipients: () => void;
}