import { Dispatch, SetStateAction } from "react";

export type FormDataProps = {
	formTitle: string;
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
