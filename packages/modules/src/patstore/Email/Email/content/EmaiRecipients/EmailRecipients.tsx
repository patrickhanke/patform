"use client";

import { FC, useEffect, useState } from "react";
import { EmailRecipient } from "@repo/types";
import { EmailRecipientsProps, EmailStatus } from "./types";

interface RecipientWithStatus extends EmailRecipient {
	status: EmailStatus;
	loading: boolean;
	error?: string;
}

const EmailRecipients: FC<EmailRecipientsProps> = ({ email }) => {
	const [recipients, setRecipients] = useState<RecipientWithStatus[]>([]);

	useEffect(() => {
		if (email?.recipients) {
			// Initialize recipients with loading state
			const initialRecipients: RecipientWithStatus[] =
				email.recipients.map((recipient) => ({
					...recipient,
					status: "unknown" as EmailStatus,
					loading: !!recipient.message_id
				}));
			setRecipients(initialRecipients);

			// Fetch status for each recipient with message_id
			email.recipients.forEach((recipient, index) => {
				if (recipient.message_id) {
					fetchEmailStatus(recipient.message_id, index);
				}
			});
		}
	}, [email]);

	const fetchEmailStatus = async (messageId: string, index: number) => {
		try {
			const apiKey = process.env.NEXT_PUBLIC_LETTERMINT_API_KEY;

			console.log("apiKey", apiKey);

			if (!apiKey) {
				console.error(
					"Lettermint API key not found in environment variables"
				);
				updateRecipientStatus(
					index,
					"unknown",
					false,
					"API key not configured"
				);
				return;
			}

			const response = await fetch(
				`https://api.lettermint.com/v1/messages/${messageId}`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${apiKey}`,
						"Content-Type": "application/json"
					}
				}
			);

			if (!response.ok) {
				throw new Error(
					`Failed to fetch status: ${response.statusText}`
				);
			}

			const data = await response.json();
			const status = data.status || "unknown";

			updateRecipientStatus(index, status, false);
		} catch (error) {
			console.error(
				`Error fetching email status for message ${messageId}:`,
				error
			);
			updateRecipientStatus(
				index,
				"unknown",
				false,
				error instanceof Error
					? error.message
					: "Failed to fetch status"
			);
		}
	};

	const updateRecipientStatus = (
		index: number,
		status: EmailStatus,
		loading: boolean,
		error?: string
	) => {
		setRecipients((prev) => {
			const updated = [...prev];
			if (updated[index]) {
				updated[index] = {
					...updated[index],
					status,
					loading,
					error
				};
			}
			return updated;
		});
	};

	const getStatusBadgeClass = (status: EmailStatus): string => {
		switch (status) {
			case "delivered":
			case "sent":
				return "success";
			case "opened":
			case "clicked":
				return "info";
			case "bounced":
			case "failed":
				return "danger";
			case "complained":
				return "warning";
			case "unsubscribed":
				return "secondary";
			case "pending":
				return "warning";
			case "unknown":
			default:
				return "default";
		}
	};

	const getStatusLabel = (status: EmailStatus): string => {
		const labels: Record<EmailStatus, string> = {
			sent: "Gesendet",
			delivered: "Zugestellt",
			opened: "Geöffnet",
			clicked: "Geklickt",
			bounced: "Zurückgewiesen",
			complained: "Als Spam markiert",
			unsubscribed: "Abgemeldet",
			failed: "Fehlgeschlagen",
			pending: "Ausstehend",
			unknown: "Unbekannt"
		};
		return labels[status] || "Unbekannt";
	};

	if (!email || !recipients.length) {
		return (
			<div className="flex col gap-md">
				<h3>Empfänger</h3>
				<p>Keine Empfänger vorhanden</p>
			</div>
		);
	}

	return (
		<div className="flex col gap-md">
			<h3>Empfänger ({recipients.length})</h3>

			<div className="table-container">
				<table className="table">
					<thead>
						<tr>
							<th>Name</th>
							<th>E-Mail</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{recipients.map((recipient, index) => (
							<tr key={`${recipient.email}-${index}`}>
								<td>{recipient.name || "-"}</td>
								<td>{recipient.email}</td>
								<td>
									{recipient.loading ? (
										<span className="badge default">
											Lädt...
										</span>
									) : (
										<span
											className={`badge ${getStatusBadgeClass(recipient.status)}`}
											title={recipient.error || undefined}
										>
											{getStatusLabel(recipient.status)}
										</span>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{recipients.some((r) => r.error) && (
				<div className="alert warning">
					<p>
						<strong>Hinweis:</strong> Einige Status konnten nicht
						abgerufen werden. Dies kann bedeuten, dass die E-Mail
						noch nicht versendet wurde oder die Nachricht-ID
						ungültig ist.
					</p>
				</div>
			)}
		</div>
	);
};

export default EmailRecipients;
