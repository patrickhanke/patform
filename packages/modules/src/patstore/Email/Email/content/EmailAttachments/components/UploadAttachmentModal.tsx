"use client";

import { FC, useState } from "react";
import { UploadAttachmentModalProps } from "../types";
import { Modal } from "@repo/ui";
import { useDataHandler } from "@repo/provider";
import { uploadFileAndCreateRecord } from "../functions/uploadFileAndCreateRecord";

const UploadAttachmentModal: FC<UploadAttachmentModalProps> = ({
	isOpen,
	setIsOpen,
	emailId,
	refetch,
	refetchEmail
}) => {
	const { updateData, deleteData } = useDataHandler();
	const [title, setTitle] = useState("");
	const [file, setFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const selectedFile = e.target.files[0];
			setFile(selectedFile);
			if (!title) {
				setTitle(selectedFile.name);
			}
		}
	};

	const handleUpload = async () => {
		if (!title.trim()) {
			setError("Bitte geben Sie einen Titel ein.");
			return;
		}
		if (!file) {
			setError("Bitte wählen Sie eine Datei aus.");
			return;
		}

		setError("");
		setLoading(true);

		let fileObjectId: string | null = null;

		try {
			fileObjectId = await uploadFileAndCreateRecord({
				file,
				title: title.trim(),
				referenceId: emailId
			});

			let updateFailed = false;
			await updateData({
				className: "Email",
				objectId: emailId,
				updateObject: {
					attachments: {
						__op: "AddUnique",
						objects: [fileObjectId]
					}
				},
				onError: () => {
					updateFailed = true;
				}
			});

			if (updateFailed) {
				await deleteData({
					className: "Document",
					objectId: fileObjectId
				});
				throw new Error("Failed to link attachment to email");
			}

			await Promise.all([refetch(), refetchEmail()]);

			setTitle("");
			setFile(null);
			setIsOpen(false);
		} catch (uploadError) {
			console.error("Error uploading file:", uploadError);
			setError(
				"Fehler beim Hochladen der Datei. Bitte versuchen Sie es erneut."
			);
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		setTitle("");
		setFile(null);
		setError("");
		setIsOpen(false);
	};

	return (
		<Modal
			isOpen={isOpen}
			cancelButtonHandler={handleCancel}
			confirmButtonHandler={handleUpload}
			buttonDisabled={[loading, loading]}
			header="Neue Datei hinzufügen"
			confirmButtonText="Hochladen"
			cancelButtonText="Abbrechen"
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "20px"
				}}
			>
				{error && (
					<div
						style={{
							padding: "12px",
							backgroundColor: "#fee",
							border: "1px solid #fcc",
							borderRadius: "4px",
							color: "#c00"
						}}
					>
						{error}
					</div>
				)}

				<div>
					<label
						htmlFor="file-title"
						style={{
							display: "block",
							marginBottom: "8px",
							fontWeight: 600,
							fontSize: "14px"
						}}
					>
						Titel <span style={{ color: "red" }}>*</span>
					</label>
					<input
						id="file-title"
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Dateititel eingeben"
						disabled={loading}
						style={{
							width: "100%",
							padding: "8px 12px",
							border: "1px solid #ccc",
							borderRadius: "4px",
							fontSize: "14px"
						}}
					/>
				</div>

				<div>
					<label
						htmlFor="file-upload"
						style={{
							display: "block",
							marginBottom: "8px",
							fontWeight: 600,
							fontSize: "14px"
						}}
					>
						Datei <span style={{ color: "red" }}>*</span>
					</label>
					<input
						id="file-upload"
						type="file"
						onChange={handleFileChange}
						disabled={loading}
						style={{
							width: "100%",
							padding: "8px",
							border: "1px solid #ccc",
							borderRadius: "4px",
							fontSize: "14px"
						}}
					/>
					{file && (
						<p
							style={{
								marginTop: "8px",
								fontSize: "14px",
								color: "#666"
							}}
						>
							Ausgewählte Datei: {file.name} (
							{(file.size / 1024).toFixed(2)} KB)
						</p>
					)}
				</div>

				<div
					style={{
						fontSize: "12px",
						color: "#666",
						padding: "12px",
						backgroundColor: "#f5f5f5",
						borderRadius: "4px"
					}}
				>
					<p style={{ margin: "0 0 4px 0" }}>
						<strong>Hinweis:</strong>
					</p>
					<ul style={{ margin: 0, paddingLeft: "20px" }}>
						<li>Der Titel ist ein Pflichtfeld</li>
						<li>
							Die Datei wird mit der E-Mail verknüpft
							(reference_id)
						</li>
						<li>
							Nach dem Upload wird die Datei-ID zum E-Mail-Anhang
							hinzugefügt
						</li>
					</ul>
				</div>
			</div>
		</Modal>
	);
};

export default UploadAttachmentModal;
