import { useFindData } from "@repo/provider";
import { UseFindRolesHook } from "../types";

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

	const { data, loading, error } = useFindData({
		objectName: "Role",
		fields: roleFields,
		projectId: projectId
	});

	return {
		roles: data ?? [],
		rolesLoading: loading,
		rolesError: error
	};
};

export default useFindRoles;
