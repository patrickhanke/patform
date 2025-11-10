import { generateGraphQLQuery, paramsHandler } from "@repo/provider";
import { useQuery } from "@apollo/client";

const useFindRoles = ({ projectId }: { projectId: string }) => {
	const { data, error, loading } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "_Role",
			fields: ["objectId", "name"]
		}),
		{
			variables: {
				params: paramsHandler({
					filters: [
						{
							key: "project",
							value: projectId,
							operator: "_eq",
							id: "project"
						}
					]
				})
			}
		}
	);

	return {
		roles: data?.objects.find_Role.results || [],
		loading,
		error
	};
};

export default useFindRoles;
