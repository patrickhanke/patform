import { Dispatch, SetStateAction } from "react";
import { ContentBlock } from "@repo/ui";

export type EmailRecipient = {
	data: {
		label: string;
		title: string;
		pre_title: string;
		first_name: string;
		last_name: string;
	};
	suppressed: boolean;
	listName: string;
	userId: string;
	email: string;
};

export type EmailRescipientResponse = {
	result: {
		recipients: EmailRecipient[];
		suppressedRecipients: EmailRecipient[];
	};
};

export type BulkEmailSenderProps = {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	emailContent: ContentBlock[];
	emailId: string;
	recipients: EmailRecipient[];
	onSendSuccess?: () => void | Promise<void>;
};
