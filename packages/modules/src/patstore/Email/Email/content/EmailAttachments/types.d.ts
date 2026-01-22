import { ApolloRefetch, EmailClass } from "@repo/types";

export interface EmailAttachmentsProps {
	emailId: string;
	email: EmailClass;
}

export interface AttachmentsListProps {
	attachments: FileAttachment[];
	emailId: string;
	email: EmailClass;
	refetch: ApolloRefetch;
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
	email: EmailClass;
	refetch: ApolloRefetch;
}
