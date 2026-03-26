import { PatstoreUser, ApolloRefetch } from "@repo/types";

export interface TableColumnEmailSettingsProps {
	userId: string;
	emails: PatstoreUser["emails"];
	refetch: ApolloRefetch;
}

export interface EmailListManagerProps {
	email: string;
	currentLists: string[];
	projectLists: { objectId: string; title: string }[];
	listsLoading: boolean;
	onListsChange: (lists: string[]) => void;
	onClose: () => void;
	/** Return false to keep the edit modal open (e.g. duplicate email). */
	onEmailChange: (newEmail: string) => boolean;
	onEmailDelete: () => void;
}
