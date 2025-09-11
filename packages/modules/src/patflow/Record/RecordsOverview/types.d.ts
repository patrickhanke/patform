import { ApolloRefetch, Record } from "@repo/types";

export type GetRecordObject = {
	loading: boolean;
	records: Record[];
	refetch: ApolloRefetch;
};

export type StaffOption = { value: string; label: string } & UserDisplayData;
