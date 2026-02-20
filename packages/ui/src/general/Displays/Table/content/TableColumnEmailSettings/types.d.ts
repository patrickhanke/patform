import { PatstoreUser, ApolloRefetch } from "@repo/types";

export interface TableColumnEmailSettingsProps {
	userId: string;
	emails: PatstoreUser["emails"];
	refetch: ApolloRefetch;
}
