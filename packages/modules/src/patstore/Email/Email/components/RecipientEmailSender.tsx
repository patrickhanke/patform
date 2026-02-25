"use client";

import {
	Dispatch,
	FC,
	SetStateAction,
	useCallback,
	useMemo,
	useState
} from "react";
import { SlideIn, ProgressBar, InfoBox } from "@repo/ui";
import { axiosclient, compileAxiosError, useAppContext } from "@repo/provider";
import { transformToEmail } from "@repo/ui";
import { ContentBlock } from "@repo/ui";
import { Trash2 } from "lucide-react";

export type RecipientEmailSenderProps = {
	recipientEmailOpen: boolean;
	setRecipientOpen: Dispatch<SetStateAction<boolean>>;
	emailContent: ContentBlock[];
	emailId: string;
};

interface EmailRecipient {
	email: string;
	id: string;
}

const RecipientEmailSender: FC<RecipientEmailSenderProps> = ({
	recipientEmailOpen,
	setRecipientOpen,
	emailContent,
	emailId
}) => {
	const { project } = useAppContext();
	const [recipients, setRecipients] = useState<EmailRecipient[]>([]);
	const [currentEmail, setCurrentEmail] = useState<string>("");
	const [emailError, setEmailError] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [sentEmails, setSentEmails] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const [isSending, setIsSending] = useState(false);

	// Email validation regex
	const validateEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const addRecipient = useCallback(() => {
		if (!currentEmail.trim()) {
			setEmailError("Bitte geben Sie eine E-Mail-Adresse ein");
			return;
		}

		if (!validateEmail(currentEmail.trim())) {
			setEmailError("Bitte geben Sie eine gültige E-Mail-Adresse ein");
			return;
		}

		const emailLower = currentEmail.trim().toLowerCase();
		if (recipients.some((r) => r.email.toLowerCase() === emailLower)) {
			setEmailError("Diese E-Mail-Adresse wurde bereits hinzugefügt");
			return;
		}

		setRecipients([
			...recipients,
			{
				email: currentEmail.trim(),
				id: `${Date.now()}-${Math.random()}`
			}
		]);
		setCurrentEmail("");
		setEmailError("");
	}, [currentEmail, recipients]);

	const removeRecipient = useCallback(
		(id: string) => {
			setRecipients(recipients.filter((r) => r.id !== id));
		},
		[recipients]
	);

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			addRecipient();
		}
	};

	const sendEmailsToRecipients = useCallback(async () => {
		if (recipients.length === 0) {
			setError("Keine Empfänger vorhanden");
			return;
		}

		setIsSending(true);
		setLoading(true);
		setError(null);
		setSentEmails(0);
		setProgress(0);

		const BATCH_SIZE = 20;
		const totalBatches = Math.ceil(recipients.length / BATCH_SIZE);

		try {
			for (let i = 0; i < totalBatches; i++) {
				const start = i * BATCH_SIZE;
				const end = Math.min(start + BATCH_SIZE, recipients.length);
				const batch = recipients.slice(start, end);

				// Transform recipients to match the expected format
				const formattedRecipients = batch.map((recipient) => ({
					name: recipient.email,
					email: recipient.email,
					data: {
						first_name: "",
						last_name: "",
						title: "",
						pre_title: "",
						post_title: "",
						unsubscribe_link: undefined,
						list_name: ""
					}
				}));

				// Send batch
				await axiosclient()
					.post("functions/send_email_to_users", {
						email_id: emailId,
						project_id: project.objectId,
						content: transformToEmail(emailContent),
						recipients: formattedRecipients
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
				setRecipientOpen(false);
				setLoading(false);
				setIsSending(false);
				// Reset state
				setRecipients([]);
				setCurrentEmail("");
				setSentEmails(0);
				setProgress(0);
			}, 1500);
		} catch (err) {
			console.error("Error sending emails:", err);
			setError(
				err instanceof Error
					? err.message
					: "Fehler beim Versenden der E-Mails"
			);
			setLoading(false);
			setIsSending(false);
		}
	}, [recipients, emailContent, emailId, project, setRecipientOpen]);

	const handleClose = () => {
		if (!loading) {
			setRecipientOpen(false);
			// Reset state
			setRecipients([]);
			setCurrentEmail("");
			setEmailError("");
			setProgress(0);
			setSentEmails(0);
			setError(null);
			setIsSending(false);
		}
	};

	const recipientList = useMemo(
		() => (
			<div className="flex col gap-md">
				{/* Email Input Section */}
				<div className="flex col gap-sm">
					<label className="text-sm font-medium">
						E-Mail-Adresse hinzufügen
					</label>
					<div className="flex row gap-sm">
						<input
							type="email"
							value={currentEmail}
							onChange={(e) => {
								setCurrentEmail(e.target.value);
								setEmailError("");
							}}
							onKeyPress={handleKeyPress}
							placeholder="beispiel@email.de"
							className="flex-1"
							disabled={isSending}
						/>
						<button
							type="button"
							onClick={addRecipient}
							disabled={isSending || !currentEmail.trim()}
							className="full_button sm primary"
						>
							<span>Hinzufügen</span>
						</button>
					</div>
					{emailError && (
						<p className="text-sm text-danger">{emailError}</p>
					)}
				</div>

				{/* Recipients List */}
				{recipients.length > 0 && (
					<div className="flex col gap-sm">
						<label className="text-sm font-medium">
							Empfänger ({recipients.length})
						</label>
						<div className="flex col gap-xs max-h-96 overflow-y-auto border rounded p-sm">
							{recipients.map((recipient) => (
								<div
									key={recipient.id}
									className="flex row gap-sm items-center justify-between p-sm bg-gray-50 rounded hover:bg-gray-100"
								>
									<span className="text-sm flex-1">
										{recipient.email}
									</span>
									<button
										type="button"
										onClick={() =>
											removeRecipient(recipient.id)
										}
										disabled={isSending}
										className="text-danger hover:text-danger-dark"
										aria-label="Empfänger entfernen"
									>
										<Trash2 size={16} />
									</button>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Progress Section */}
				{isSending && (
					<div className="flex col gap-sm">
						<p>
							E-Mails werden versendet: {sentEmails} von{" "}
							{recipients.length}
						</p>
						<ProgressBar completed={progress} />
					</div>
				)}

				{/* Success Message */}
				{!isSending && sentEmails > 0 && !error && (
					<div className="flex col gap-sm">
						<p className="text-success">
							✓ Alle {recipients.length} E-Mails wurden
							erfolgreich versendet!
						</p>
						<ProgressBar completed={100} />
					</div>
				)}

				{/* Error Message */}
				{error && (
					<div className="flex col gap-sm">
						<p className="text-danger">Fehler: {error}</p>
						<p className="text-sm">
							{sentEmails} von {recipients.length} E-Mails wurden
							erfolgreich versendet.
						</p>
						{sentEmails > 0 && (
							<ProgressBar
								completed={
									(sentEmails / recipients.length) * 100
								}
							/>
						)}
					</div>
				)}

				{/* Empty State */}
				{recipients.length === 0 && !isSending && (
					<p className="text-sm text-gray-600">
						Fügen Sie E-Mail-Adressen hinzu, um die E-Mail zu
						versenden.
					</p>
				)}
			</div>
		),
		[
			recipients,
			currentEmail,
			emailError,
			isSending,
			sentEmails,
			progress,
			error,
			addRecipient,
			removeRecipient
		]
	);

	const handleConfirm = () => {
		if (!isSending) {
			sendEmailsToRecipients();
		}
	};

	return (
		<SlideIn
			isOpen={recipientEmailOpen}
			cancel={handleClose}
			confirm={handleConfirm}
			disabled={[
				loading || recipients.length === 0,
				loading || recipients.length === 0
			]}
			header="E-Mail an Empfänger versenden"
			confirmText={isSending ? "Wird gesendet..." : "Senden"}
		>
			{recipientList}
			<InfoBox
				text="Diese E-Mail wird an die ausgewählten Empfänger versendet. Die Empfänger erhalten keine Möglichkeit, sich abzumelden. Hierfür sollten Sie eine Empfängerliste erstellen."
				status="info"
			/>
		</SlideIn>
	);
};

export default RecipientEmailSender;
