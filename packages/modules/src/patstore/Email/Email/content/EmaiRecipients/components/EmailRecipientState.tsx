"use client";

import React, { useEffect, useState } from "react";
import { EmailStatus } from "../types";

// Use same-origin API proxy to avoid CORS (browser -> our API -> LetterMint)
const getMessageUrl = (messageId: string) =>
	`/api/lettermint/messages/${messageId}`;

const mapLettermintStatus = (status: string): EmailStatus => {
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
	messageId: string;
}

const EmailRecipientState = ({ messageId }: EmailRecipientStateProps) => {
	const [state, setState] = useState<EmailStatus>("unknown");
	const [loading, setLoading] = useState(!!messageId);

	useEffect(() => {
		if (!messageId) return;

		const fetchEmailStatus = async () => {
			try {
				const response = await fetch(getMessageUrl(messageId), {
					method: "GET",
					headers: { "Content-Type": "application/json" }
				});

				if (response.ok) {
					const data = await response.json();
					setState(mapLettermintStatus(data.status ?? "unknown"));
				} else {
					setState("unknown");
				}
			} catch {
				setState("unknown");
			} finally {
				setLoading(false);
			}
		};

		fetchEmailStatus();
	}, [messageId]);

	if (loading) {
		return <span className="badge default">Lädt...</span>;
	}

	return <span className={`badge ${state}`}>{state}</span>;
};

export default EmailRecipientState;
