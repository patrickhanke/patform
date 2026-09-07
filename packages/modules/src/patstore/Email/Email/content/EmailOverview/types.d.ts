import { EmailTemplate } from "@repo/types";

export type { EmailRecipient, EmailRescipientResponse } from "../../types";

export interface EmailOverviewProps {
	email: EmailTemplate;
}
