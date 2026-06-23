"use client";

import { FC, useState } from "react";
import { FileAttachment } from "../types";
import { ApolloRefetch, useDataHandler } from "@repo/provider";
import { formatFileSize } from "../functions/formatFileSize";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Modal } from "@repo/ui";

interface AttachmentItemProps {
	attachment: FileAttachment;
	emailId: string;
	refetch: ApolloRefetch;
	refetchEmail: ApolloRefetch;
}

const AttachmentItem: FC<AttachmentItemProps> = ({
	attachment,
	emailId,
	refetch,
	refetchEmail
}) => {
	const { deleteData, updateData } = useDataHandler();
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleDelete = async () => {
		setLoading(true);

		try {
			await deleteData({
				className: "Document",
				objectId: attachment.objectId,
				feedback: "Datei erfolgreich gelöscht"
			});

			let updateFailed = false;
			await updateData({
				className: "Email",
				objectId: emailId,
				updateObject: {
					attachments: {
						__op: "Remove",
						objects: [attachment.objectId]
					}
				},
				onError: () => {
					updateFailed = true;
				}
			});

			if (updateFailed) {
				throw new Error("Failed to remove attachment from email");
			}

			await Promise.all([refetch(), refetchEmail()]);
			setDeleteModalOpen(false);
		} catch (error) {
			console.error("Error deleting attachment:", error);
		} finally {
			setLoading(false);
		}
	};

	const getFileIcon = (fileName: string) => {
		const extension = fileName.split(".").pop()?.toLowerCase();
		switch (extension) {
			case "pdf":
				return "📄";
			case "doc":
			case "docx":
				return "📝";
			case "xls":
			case "xlsx":
				return "📊";
			case "jpg":
			case "jpeg":
			case "png":
			case "gif":
				return "🖼️";
			case "zip":
			case "rar":
				return "📦";
			default:
				return "📎";
		}
	};

	return (
		<>
			<div
				className="attachment-item"
				style={{
					border: "1px solid #e0e0e0",
					borderRadius: "8px",
					padding: "16px",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					gap: "16px",
					backgroundColor: "#fff"
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "12px",
						flex: 1
					}}
				>
					<div style={{ fontSize: "32px" }}>
						{getFileIcon(attachment.file?.name || "")}
					</div>
					<div style={{ flex: 1, minWidth: 0 }}>
						<h4
							style={{
								margin: "0 0 4px 0",
								fontSize: "16px",
								fontWeight: 600
							}}
						>
							{attachment.title}
						</h4>
						<p
							style={{
								margin: "0",
								fontSize: "14px",
								color: "#666"
							}}
						>
							{attachment.file?.name}
							{attachment.file?.size &&
								` • ${formatFileSize(attachment.file.size)}`}
						</p>
						{attachment.createdAt && (
							<p
								style={{
									margin: "4px 0 0 0",
									fontSize: "12px",
									color: "#999"
								}}
							>
								Hochgeladen am{" "}
								{format(
									new Date(attachment.createdAt),
									"dd.MM.yyyy HH:mm",
									{
										locale: de
									}
								)}
							</p>
						)}
					</div>
				</div>
				<div style={{ display: "flex", gap: "8px" }}>
					<a
						href={attachment.file?.url}
						target="_blank"
						rel="noopener noreferrer"
						className="full_button sm secondary"
					>
						Download
					</a>
					<button
						className="full_button sm danger"
						onClick={() => setDeleteModalOpen(true)}
					>
						Löschen
					</button>
				</div>
			</div>

			<Modal
				isOpen={deleteModalOpen}
				cancelButtonHandler={() => setDeleteModalOpen(false)}
				confirmButtonHandler={handleDelete}
				buttonDisabled={[loading, loading]}
				header="Datei löschen"
			>
				<p>
					Sind Sie sicher, dass Sie die Datei &quot;{attachment.title}
					&quot; löschen möchten?
				</p>
				<p>Diese Aktion kann nicht rückgängig gemacht werden.</p>
			</Modal>
		</>
	);
};

export default AttachmentItem;
