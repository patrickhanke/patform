"use client";

import { FC, useCallback, useEffect, useState } from "react";
import { Modal, ProgressBar, Select } from "@repo/ui";
import {
	axiosclient,
	compileAxiosError,
	useAppContext,
	useDataHandler
} from "@repo/provider";
import { transformToEmail } from "@repo/ui";
import { BulkEmailSenderProps } from "../types";

const BulkEmailSender: FC<BulkEmailSenderProps> = ({
	isOpen,
	setIsOpen,
	emailContent,
	emailId,
	recipients,
	onSendSuccess
}) => {
	const { project } = useAppContext();
	const { updateData } = useDataHandler();
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [totalEmails, setTotalEmails] = useState(0);
	const [sentEmails, setSentEmails] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const [sendBroadcast, setSendBroadcast] = useState(false);
	const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
	const [startBatch, setStartBatch] = useState<number>(1);
	const [endBatch, setEndBatch] = useState<number | null>(null);

	const BATCH_SIZE = 20;
	const totalBatches = Math.ceil(recipients.length / BATCH_SIZE);

	useEffect(() => {
		if (
			recipients &&
			recipients.length > 0 &&
			totalEmails !== recipients.length
		) {
			setTotalEmails(recipients.length);
		}
	}, [recipients, totalEmails]);

	useEffect(() => {
		if (endBatch === null && totalBatches > 0) {
			setEndBatch(totalBatches);
		}
	}, [totalBatches, endBatch]);

	const sendEmailsInBulk = useCallback(async () => {
		if (recipients.length === 0) {
			setError("Keine Empfänger gefunden");
			return;
		}

		setLoading(true);
		setError(null);
		setSentEmails(0);

		const actualEndBatch = endBatch || totalBatches;
		const batchesToSend = actualEndBatch - startBatch + 1;

		try {
			for (let i = startBatch - 1; i < actualEndBatch; i++) {
				const start = i * BATCH_SIZE;
				const end = Math.min(start + BATCH_SIZE, recipients.length);
				const batch = recipients.slice(start, end);

				// Send batch
				await axiosclient()
					.post(
						sendBroadcast
							? "functions/send_broadcast_email"
							: "functions/send_email_to_users",
						{
							email_id: emailId,
							project_id: project.objectId,
							content: transformToEmail(emailContent),
							recipients: batch
						}
					)
					.catch((error) => {
						throw new Error(compileAxiosError(error).message);
					});

				// Update progress
				const batchesSent = i - (startBatch - 1) + 1;
				const emailsSent = Math.min(end, recipients.length);
				setSentEmails(emailsSent - (startBatch - 1) * BATCH_SIZE);
				setProgress((batchesSent / batchesToSend) * 100);

				// Wait 10 seconds between batches to avoid overwhelming the server
				if (i < actualEndBatch - 1) {
					await new Promise((resolve) => setTimeout(resolve, 10_000));
				}
			}

			await updateData({
				className: "Email",
				objectId: emailId,
				updateObject: { state: "sent" }
			});
			await onSendSuccess?.();

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
	}, [
		recipients,
		emailContent,
		emailId,
		project,
		setIsOpen,
		sendBroadcast,
		startBatch,
		endBatch,
		totalBatches,
		updateData,
		onSendSuccess
	]);

	const handleClose = () => {
		if (!loading) {
			setIsOpen(false);
			setProgress(0);
			setSentEmails(0);
			setError(null);
			setShowAdvancedSettings(false);
			setStartBatch(1);
			setEndBatch(totalBatches);
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
				<div className="flex row a-ce j-sb gap-sm">
					<label>Sendungstyp</label>
					<Select
						options={[
							{
								label: "Broadcast",
								value: "broadcast"
							},
							{
								label: "Transactional",
								value: "transactional"
							}
						]}
						value={sendBroadcast ? "broadcast" : "transactional"}
						onChange={(value) =>
							setSendBroadcast(value.value === "broadcast")
						}
					/>
				</div>

				{/* Advanced Settings Panel */}
				<div className="flex col gap-sm">
					<button
						type="button"
						className="text-left text-sm text-primary"
						onClick={() =>
							setShowAdvancedSettings(!showAdvancedSettings)
						}
						disabled={loading}
					>
						{showAdvancedSettings ? "▼" : "▶"} Erweiterte
						Einstellungen
					</button>

					{showAdvancedSettings && (
						<div
							className="flex col gap-sm p-sm"
							style={{
								backgroundColor: "#f5f5f5",
								borderRadius: "4px"
							}}
						>
							<p className="text-sm">
								Batch-Bereich auswählen (Batch-Größe:{" "}
								{BATCH_SIZE} Empfänger)
							</p>
							<div className="flex row gap-sm a-ce">
								<label className="text-sm">Von Batch:</label>
								<Select
									options={Array.from(
										{ length: totalBatches },
										(_, i) => ({
											label: `${i + 1} (${i * BATCH_SIZE + 1}-${Math.min(
												(i + 1) * BATCH_SIZE,
												recipients.length
											)})`,
											value: String(i + 1)
										})
									)}
									value={String(startBatch)}
									onChange={(value) => {
										const newStart = Number(value.value);
										setStartBatch(newStart);
										if (endBatch && newStart > endBatch) {
											setEndBatch(newStart);
										}
									}}
								/>
							</div>
							<div className="flex row gap-sm a-ce">
								<label className="text-sm">Bis Batch:</label>
								<Select
									options={Array.from(
										{ length: totalBatches },
										(_, i) => ({
											label: `${i + 1} (${i * BATCH_SIZE + 1}-${Math.min(
												(i + 1) * BATCH_SIZE,
												recipients.length
											)})`,
											value: String(i + 1)
										})
									).filter(
										(option) =>
											Number(option.value) >= startBatch
									)}
									value={String(endBatch || totalBatches)}
									onChange={(value) =>
										setEndBatch(Number(value.value))
									}
								/>
							</div>
							<p className="text-xs text-gray-600">
								Es werden{" "}
								{((endBatch || totalBatches) - startBatch + 1) *
									BATCH_SIZE >
								recipients.length
									? recipients.length -
										(startBatch - 1) * BATCH_SIZE
									: ((endBatch || totalBatches) -
											startBatch +
											1) *
										BATCH_SIZE}{" "}
								Empfänger versendet (Empfänger{" "}
								{(startBatch - 1) * BATCH_SIZE + 1} bis{" "}
								{Math.min(
									(endBatch || totalBatches) * BATCH_SIZE,
									recipients.length
								)}
								)
							</p>
						</div>
					)}
				</div>

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
