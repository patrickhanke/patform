import { sanitizeGraphQlNode } from "./../../../Apollo/functions/helpers";
import { useQuery } from "@apollo/client";
import { generateGraphQLQuery, generateGraphQLQuery_4_1 } from "@repo/provider";
import { UseFindRolesHook } from "../types";
import { PatstoreRoleClass } from "@repo/types";

const useFindRoles: UseFindRolesHook = ({ appId, projectId }) => {
	const roleFields =
		appId === "patstore"
			? [
					"objectId",
					"name",
					"users {edges{node{objectId username}}}",
					"default",
					"modules {...on Element {value}}",
					"color",
					"title"
				]
			: ["name", "objectId"];

	const { data, loading, error } = useQuery(
		appId === "patstore"
			? generateGraphQLQuery_4_1({
					type: "find",
					objectName: "Role",
					queryName: "roles",
					fields: roleFields
				})
			: generateGraphQLQuery({
					type: "find",
					objectName: "_Role",
					queryName: "role",
					fields: roleFields
				}),
		{
			variables: {
				params:
					appId === "patflow"
						? { project: { _eq: projectId } }
						: { project: { have: { id: { equalTo: projectId } } } }
			},
			skip: !projectId
		}
	);

	return {
		roles:
			appId === "patstore"
				? data?.roles.edges.map((edge: { node: PatstoreRoleClass }) =>
						sanitizeGraphQlNode(edge.node)
					)
				: data?.objects.find_Role.results || [],
		rolesLoading: loading,
		rolesError: error
	};
};

export default useFindRoles;
