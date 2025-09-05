import { ApolloRefetch } from "@repo/types";
export type DownloadOption = {
	value: string;
	label: string;
};

export type DownloadSelectProps = {
	isMulti?: boolean;
	setFieldValue: (value: string | string[]) => void;
	options: DownloadOption[];
	values: string | string[];
	refetch: ApolloRefetch;
	name?: string;
};
