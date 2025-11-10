import { useQuery } from "@apollo/client";
import { generateGraphQLQuery } from "@repo/provider";
import { FormClass, ApolloRefetch } from "@repo/types";

export const useGetForm = ({ formId }: { formId: string }) => {
	const { data, loading, refetch } = useQuery(
		generateGraphQLQuery({
			type: "get",
			objectName: "Form",
			fields: [
				"objectId",
				"title",
				"description",
				"fields",
				"categories",
				"settings"
			]
		}),
		{
			variables: { id: formId }
		}
	);

	return {
		form: data ? data.objects.getForm : null,
		loading,
		refetch
	} as {
		form: FormClass;
		loading: boolean;
		refetch: ApolloRefetch;
	};
};
