"use client";

import { ContentBlock, ContentEditor } from "@repo/ui";
import { FC, useCallback } from "react";

import { EmailContentProps } from "./types";
import { useDataHandler } from "@repo/provider";

const EmailContent: FC<EmailContentProps> = ({
	emailId,
	emailContent,
	refetch
}) => {
	const { updateData } = useDataHandler();

	const updateContent = useCallback(
		async (content: ContentBlock[]) => {
			await updateData({
				className: "Email",
				objectId: emailId,
				updateObject: {
					content: content
				},
				feedback: "Inhalte aktualisiert"
			});
			refetch();
		},
		[updateData]
	);

	return (
		<div>
			<ContentEditor
				content={emailContent}
				onChange={(content) => updateContent(content)}
			/>
		</div>
	);
};

export default EmailContent;
