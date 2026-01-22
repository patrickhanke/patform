"use client";

import { FC, useMemo } from "react";
import { useGetData } from "@repo/provider";
import { RecipientCount } from "./components";
import { EmailClass } from "@repo/types";

export interface EmailOverviewProps {
	email: EmailClass;
	projectId: string;
}

const EmailOverview: FC<EmailOverviewProps> = ({ email, projectId }) => {
	const attachmentCount = useMemo(() => {
		return email?.attachments?.length || 0;
	}, [email]);

	const emailState = useMemo(() => {
		// Check if state field exists, otherwise default to "draft"
		if (email?.state) {
			return email.state === "sent" ? "Versendet" : "Entwurf";
		}
		return "Entwurf";
	}, [email]);

	const sendDate = useMemo(() => {
		// Check if date field exists
		if (email?.date) {
			return new Date(email.date).toLocaleString("de-DE", {
				year: "numeric",
				month: "long",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit"
			});
		}
		return "-";
	}, [email]);

	if (!email) {
		return <div>Lädt ...</div>;
	}

	return (
		<div className="flex col gap-lg">
			<div className="flex col gap-md">
				<div className="flex col gap-sm">
					<div className="flex row gap-md ai-ce">
						<div style={{ minWidth: "180px", fontWeight: "600" }}>
							Anzahl Empfänger:
						</div>
						<div>
							<RecipientCount email={email} />
						</div>
					</div>

					<div className="flex row gap-md ai-ce">
						<div style={{ minWidth: "180px", fontWeight: "600" }}>
							Anzahl Anhänge:
						</div>
						<div>{attachmentCount}</div>
					</div>

					<div className="flex row gap-md	 ai-ce">
						<div style={{ minWidth: "180px", fontWeight: "600" }}>
							Status:
						</div>
						<div>
							<span
								className={`badge ${emailState === "Versendet" ? "success" : "warning"}`}
							>
								{emailState}
							</span>
						</div>
					</div>

					<div className="flex row gap-md ai-ce">
						<div style={{ minWidth: "180px", fontWeight: "600" }}>
							Versanddatum:
						</div>
						<div>{sendDate}</div>
					</div>
				</div>
			</div>

			<div className="flex col gap-sm">
				<h3>Weitere Informationen</h3>
				<div className="flex row gap-md ai-ce">
					<div style={{ minWidth: "180px", fontWeight: "600" }}>
						Erstellt am:
					</div>
					<div>
						{email.createdAt
							? new Date(email.createdAt).toLocaleString(
									"de-DE",
									{
										year: "numeric",
										month: "long",
										day: "numeric",
										hour: "2-digit",
										minute: "2-digit"
									}
								)
							: "-"}
					</div>
				</div>

				<div className="flex row gap-md ai-ce">
					<div style={{ minWidth: "180px", fontWeight: "600" }}>
						Zuletzt aktualisiert:
					</div>
					<div>
						{email.updatedAt
							? new Date(email.updatedAt).toLocaleString(
									"de-DE",
									{
										year: "numeric",
										month: "long",
										day: "numeric",
										hour: "2-digit",
										minute: "2-digit"
									}
								)
							: "-"}
					</div>
				</div>
			</div>
		</div>
	);
};

export default EmailOverview;
