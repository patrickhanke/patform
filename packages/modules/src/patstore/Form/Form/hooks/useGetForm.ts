import { useGetData } from "@repo/provider";
import { FormClass, ApolloRefetch } from "@repo/types";

export const useGetForm = ({ formId }: { formId: string }) => {
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
		id: formId
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
