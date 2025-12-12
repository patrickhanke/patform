import { PatstoreProjectInvitation } from "@repo/types";

export type DeleteInvitationProps = {
	username: string;
	email: string;
	refetch: ApolloRefetch;
	id: string;
	invitations: PatstoreProjectInvitation[];
	projectId: string;
};

export type SendInvitationProps = {
	username: string;
	email: string;
	projectId: string;
	refetch: ApolloRefetch;
};
