"use client";

import {
	Dispatch,
	FC,
	SetStateAction,
	useCallback,
	useEffect,
	useState
} from "react";
import { ContentBlock, Modal, ProgressBar } from "@repo/ui";
import { axiosclient, compileAxiosError, useAppContext } from "@repo/provider";
import { transformToEmail } from "@repo/ui";

export type BulkEmailSenderProps = {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	emailContent: ContentBlock[];
	emailId: string;
	listId: string;
};

interface EmailRecipient {
	name: string;
	email: string;
	data: {
		first_name: string;
		last_name: string;
		title: string;
		pre_title: string;
		post_title: string;
		unsubscribe_link: string | undefined;
		list_name: string;
	};
}

const BulkEmailSender: FC<BulkEmailSenderProps> = ({
	isOpen,
	setIsOpen,
	emailContent,
	emailId,
	listId
}) => {
	const { project } = useAppContext();
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [totalEmails, setTotalEmails] = useState(0);
	const [sentEmails, setSentEmails] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const [recipients, setRecipients] = useState<EmailRecipient[]>([]);

	const findRecipients = useCallback(async () => {
		const response = await axiosclient().post(
			"functions/get_list_recipients",
			{
				list_id: listId
			}
		);
		console.log("response", response.data);
		setRecipients(response.data.result);
	}, [listId]);

	useEffect(() => {
		if (listId) {
			findRecipients();
		}
	}, [listId]);

	useEffect(() => {
		if (
			recipients &&
			recipients.length > 0 &&
			totalEmails !== recipients.length
		) {
			setTotalEmails(recipients.length);
		}
	}, [recipients, totalEmails]);

	console.log("recipients", recipients);

	const sendEmailsInBulk = useCallback(async () => {
		if (recipients.length === 0) {
			setError("Keine Empfänger gefunden");
			return;
		}

		setLoading(true);
		setError(null);
		setSentEmails(0);

		const BATCH_SIZE = 20;
		const totalBatches = Math.ceil(recipients.length / BATCH_SIZE);

		try {
			for (let i = 0; i < totalBatches; i++) {
				const start = i * BATCH_SIZE;
				const end = Math.min(start + BATCH_SIZE, recipients.length);
				const batch = recipients.slice(start, end);

				// Send batch
				await axiosclient()
					.post("functions/send_broadcast_email", {
						email_id: emailId,
						project_id: project.objectId,
						content: transformToEmail(emailContent),
						recipients: batch
					})
					.catch((error) => {
						throw new Error(compileAxiosError(error).message);
					});

				// Update progress
				const emailsSent = end;
				setSentEmails(emailsSent);
				setProgress((emailsSent / recipients.length) * 100);

				// Small delay between batches to avoid overwhelming the server
				if (i < totalBatches - 1) {
					await new Promise((resolve) => setTimeout(resolve, 500));
				}
			}

			// Success - close modal after a brief delay
			setTimeout(() => {
				setIsOpen(false);
				setLoading(false);
			}, 1500);
		} catch (err) {
			console.error("Error sending emails:", err);
			setError(
				err instanceof Error
					? err.message
					: "Fehler beim Versenden der E-Mails"
			);
			setLoading(false);
		}
	}, [recipients, emailContent, emailId, project, setIsOpen]);

	console.log("recipients", recipients);

	const handleClose = () => {
		if (!loading) {
			setIsOpen(false);
			setProgress(0);
			setSentEmails(0);
			setError(null);
		}
	};

	return (
		<Modal
			header="E-Mails versenden"
			isOpen={isOpen}
			cancelButtonHandler={handleClose}
			confirmButtonHandler={loading ? undefined : sendEmailsInBulk}
			buttonDisabled={[loading, loading || recipients.length === 0]}
			confirmButtonText={loading ? "Wird gesendet..." : "Senden"}
			cancelButtonText="Abbrechen"
		>
			<div className="flex col gap-md">
				{!loading && !error && sentEmails === 0 && (
					<>
						<p>
							Diese E-Mail wird an {totalEmails} Empfänger
							versendet.
						</p>
						<p className="text-sm text-gray-600">
							Die E-Mails werden in Stapeln von 20 versendet.
						</p>
					</>
				)}

				{loading && (
					<>
						<p>
							E-Mails werden versendet: {sentEmails} von{" "}
							{totalEmails}
						</p>
						<ProgressBar completed={progress} />
					</>
				)}

				{!loading && sentEmails > 0 && !error && (
					<div className="flex col gap-sm">
						<p className="text-success">
							✓ Alle {totalEmails} E-Mails wurden erfolgreich
							versendet!
						</p>
						<ProgressBar completed={100} />
					</div>
				)}

				{error && (
					<div className="flex col gap-sm">
						<p className="text-danger">Fehler: {error}</p>
						<p className="text-sm">
							{sentEmails} von {totalEmails} E-Mails wurden
							erfolgreich versendet.
						</p>
						{sentEmails > 0 && (
							<ProgressBar
								completed={(sentEmails / totalEmails) * 100}
							/>
						)}
					</div>
				)}

				{recipients.length === 0 && !loading && (
					<p className="text-warning">
						Keine Empfänger in dieser Liste gefunden.
					</p>
				)}
			</div>
		</Modal>
	);
};

export default BulkEmailSender;
