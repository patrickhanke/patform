"use client";

import { FC, useCallback, useEffect, useState } from "react";
import { EmailRecipient } from "@repo/types";
import { EmailRecipientsProps, EmailStatus } from "./types";
import { axiosclient } from "@repo/provider";
import EmailRecipientState from "./components/EmailRecipientState";

const EmailRecipients: FC<EmailRecipientsProps> = ({ email }) => {
	const [recipients, setRecipients] = useState<EmailRecipient[]>(
		email.recipients || []
	);
	console.log("email", email.recipients);

	console.log("recipients", recipients);

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
									{recipient.message_id && (
										<EmailRecipientState
											messageId={recipient.message_id}
										/>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{recipients.some((r) => !r.message_id) && (
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
