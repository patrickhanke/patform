import { useFindData } from "@repo/provider";

const useFindRoles = ({ projectId }: { projectId: string }) => {
	const {
		data: roles,
		loading,
		error
	} = useFindData({
		objectName: "Role",
		fields: ["objectId", "name"],
		projectId
	});

	return {
		roles: roles ?? [],
		loading,
		error
	};
};

export default useFindRoles;
