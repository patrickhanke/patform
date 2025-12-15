import { useQuery } from "@apollo/client";
import { useMemo } from "react";
import { generateGraphQLQuery } from "@repo/provider";
import { UseFindRolesHook } from "../types";

const useFindRoles: UseFindRolesHook = ({ appId, projectId }) => {
	const roleFields = useMemo(() => {
		if (appId === "patstore") {
			return [
				"objectId",
				"name",
				"users {results{objectId username}}",
				"default",
				"modules",
				"color",
				"title"
			];
		} else if (appId === "patflow") {
			return ["name", "objectId"];
		} else return [];
	}, [appId]);

	const { data, loading, error } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "_Role",
			fields: roleFields
		}),
		{
			variables: {
				params: { project: { _eq: projectId } }
			},
			skip: !projectId
		}
	);
	return {
		roles: data?.objects.find_Role.results || [],
		rolesLoading: loading,
		rolesError: error
	};
};

export default useFindRoles;
