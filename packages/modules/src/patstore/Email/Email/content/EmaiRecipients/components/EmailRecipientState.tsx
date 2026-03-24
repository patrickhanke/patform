"use client";

import { EmailStatus } from "@repo/types";
import { FC } from "react";
import { StateDisplay } from "../../../../../../../../ui/src/general";
// Use same-origin API proxy to avoid CORS (browser -> our API -> LetterMint)
const getMessageUrl = (messageId: string) =>
	`/api/lettermint/messages/${messageId}`;

const NORMALIZED_STATUSES: readonly EmailStatus[] = [
	"sent",
	"delivered",
	"opened",
	"clicked",
	"bounced",
	"complained",
	"unsubscribed",
	"failed",
	"pending",
	"unknown"
];

export const mapLettermintStatus = (status: string): EmailStatus => {
	if (NORMALIZED_STATUSES.includes(status as EmailStatus)) {
		return status as EmailStatus;
	}
	const map: Record<string, EmailStatus> = {
		delivered: "delivered",
		opened: "opened",
		clicked: "clicked",
		soft_bounced: "bounced",
		hard_bounced: "bounced",
		spam_complaint: "complained",
		unsubscribed: "unsubscribed",
		failed: "failed",
		blocked: "failed",
		policy_rejected: "failed",
		pending: "pending",
		queued: "pending",
		suppressed: "pending",
		processed: "sent"
	};
	return map[status] ?? "unknown";
};

interface EmailRecipientStateProps {
	status: EmailStatus;
}

const EmailRecipientState: FC<EmailRecipientStateProps> = ({
	status = "unknown"
}) => {

	const state = mapLettermintStatus(status);

	const getColor = (colorState: EmailStatus) => {
		switch (colorState) {
			case "sent":
				return "blue";
			case "delivered":
				return "green";
			case "opened":
				return "green";
			case "clicked":
				return "green";
			case "bounced":
				return "red";
			case "complained":
				return "red";
			default:
				return "blue";
		}
	};

	return <StateDisplay label={state} color={getColor(state)} />;
};

export default EmailRecipientState;
