import { useGetData } from "@repo/provider";
import { FormClass, ApolloRefetch } from "@repo/types";

export const useGetForm = ({
	formId,
	skip
}: {
	formId: string;
	skip?: boolean;
}) => {
	const { data, loading, refetch } = useGetData({
		objectName: "Form",
		fields: [
			"objectId",
			"title",
			"description",
			"fields",
			"categories",
			"settings"
		],
		id: formId,
		skip
	});

	return {
		form: data ? data : null,
		loading,
		refetch
	} as {
		form: FormClass;
		loading: boolean;
		refetch: ApolloRefetch;
	};
};
