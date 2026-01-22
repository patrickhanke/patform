"use client";

import { FC } from "react";
import { AttachmentsListProps } from "../types";
import AttachmentItem from "./AttachmentItem";

const AttachmentsList: FC<AttachmentsListProps> = ({
	attachments,
	emailId,
	refetch
}) => {
	if (!attachments || attachments.length === 0) {
		return (
			<div className="empty-state" style={{ padding: "40px", textAlign: "center" }}>
				<p>Keine Anhänge vorhanden</p>
				<p style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>
					Klicken Sie auf "Neue Datei hinzufügen", um einen Anhang hochzuladen.
				</p>
			</div>
		);
	}

	return (
		<div className="attachments-list">
			<div className="attachments-grid" style={{ display: "grid", gap: "16px" }}>
				{attachments.map((attachment) => (
					<AttachmentItem
						key={attachment.objectId}
						attachment={attachment}
						emailId={emailId}
						refetch={refetch}
					/>
				))}
			</div>
		</div>
	);
};

export default AttachmentsList;
