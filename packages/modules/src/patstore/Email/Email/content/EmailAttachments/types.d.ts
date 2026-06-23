import { ApolloRefetch } from "@repo/types";

export interface EmailAttachmentsProps {
	emailId: string;
	refetchEmail: ApolloRefetch;
}

export interface AttachmentsListProps {
	attachments: FileAttachment[];
	emailId: string;
	refetch: ApolloRefetch;
	refetchEmail: ApolloRefetch;
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
	refetch: ApolloRefetch;
	refetchEmail: ApolloRefetch;
}
