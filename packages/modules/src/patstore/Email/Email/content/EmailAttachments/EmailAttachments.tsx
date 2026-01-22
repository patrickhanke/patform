"use client";

import { FC, useState } from "react";
import { EmailAttachmentsProps } from "./types";
import { useFindData } from "@repo/provider";
import AttachmentsList from "./components/AttachmentsList";
import UploadAttachmentModal from "./components/UploadAttachmentModal";

const EmailAttachments: FC<EmailAttachmentsProps> = ({ emailId, email }) => {
	const [uploadModalOpen, setUploadModalOpen] = useState(false);

	const { data: attachments, refetch } = useFindData({
		objectName: "Document",
		fields: ["objectId", "title", "file {name url}", "createdAt"],
		filters: [
			{
				key: "reference_id",
				operator: "equalTo",
				id: "reference_id",
				value: emailId
			}
		]
	});

	return (
		<div>
			<div
				className="flex row ai-ce j-sb gap-md"
				style={{ marginBottom: "20px" }}
			>
				<h2>Anhänge</h2>
				<button
					className="full_button md primary"
					onClick={() => setUploadModalOpen(true)}
				>
					Neue Datei hinzufügen
				</button>
			</div>

			<AttachmentsList
				attachments={attachments || []}
				emailId={emailId}
				refetch={refetch}
			/>

			<UploadAttachmentModal
				isOpen={uploadModalOpen}
				setIsOpen={setUploadModalOpen}
				emailId={emailId}
				email={email}
				refetch={refetch}
			/>
		</div>
	);
};

export default EmailAttachments;
