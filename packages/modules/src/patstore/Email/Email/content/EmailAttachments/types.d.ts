import { ApolloRefetch } from "@repo/types";

export interface EmailAttachmentsProps {
	emailId: string;
	email: any;
}

export interface AttachmentsListProps {
	attachments: FileAttachment[];
	emailId: string;
	refetch: () => void;
}

export interface FileAttachment {
	objectId: string;
	title: string;
	file: {
		name: string;
		url: string;
		size?: number;
	};
	createdAt: string;
}

export interface UploadAttachmentModalProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	emailId: string;
	email: Email;
	refetch: ApolloRefetch;
}
