import { generateGraphQLQuery_4_1, paramsHandler } from "@repo/provider";
import { useQuery } from "@apollo/client";
import { PatstoreRoleClass } from "@repo/types";

const useFindRoles = ({ projectId }: { projectId: string }) => {
	const { data, error, loading } = useQuery(
		generateGraphQLQuery_4_1({
			type: "find",
			objectName: "_Role",
			queryName: "role",
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
		roles:
			data?.roles.edges.map(
				(edge: { node: PatstoreRoleClass }) => edge.node
			) || [],
		loading,
		error
	};
};

export default useFindRoles;
