"use client";

import { ContentEditor } from "@repo/ui";
import { FC } from "react";

import { EmailContentProps } from "./types";

const EmailContent: FC<EmailContentProps> = ({
	emailContent,
	setEmailContent
}) => {
	return (
		<div>
			<ContentEditor
				content={emailContent}
				onChange={(content) => setEmailContent(content)}
			/>
		</div>
	);
};

export default EmailContent;
