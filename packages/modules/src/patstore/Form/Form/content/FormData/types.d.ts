export type FormDataProps = {
	formId: string;
	selectedDataRows: string[];
	setSelectedDataRows: (selectedDataRows: string[]) => void;
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
