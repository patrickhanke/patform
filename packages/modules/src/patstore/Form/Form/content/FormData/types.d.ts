import { Dispatch, SetStateAction } from "react";

export type FormDataProps = {
	formId: string;
	selectedDataRows: string[];
	setSelectedDataRows: Dispatch<SetStateAction<string[]>>;
};

export type UseFindFormDataHook = (T: {
	filters: FilterArray;
	skip: number;
	limit: number;
}) => {
	loading: boolean;
	data: NewsClass[];
	refetch: ApolloRefetch;
	count: number;
};
