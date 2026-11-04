type RoleUserNode = { objectId?: string };

// Roles arrive in three shapes: a Parse relation via GraphQL (`edges`), a REST
// result list (`results`), or the patflow context, which already maps users to an array.
type RoleUsers =
	| RoleUserNode[]
	| {
			edges?: { node?: RoleUserNode }[];
			results?: RoleUserNode[];
	  };

export const roleMemberIds = (users: RoleUsers | null | undefined): string[] => {
	if (!users) {
		return [];
	}
	if (Array.isArray(users)) {
		return users.flatMap((user) => (user?.objectId ? [user.objectId] : []));
	}
	if (Array.isArray(users.edges)) {
		return users.edges.flatMap((edge) =>
			edge?.node?.objectId ? [edge.node.objectId] : []
		);
	}
	if (Array.isArray(users.results)) {
		return users.results.flatMap((user) => (user?.objectId ? [user.objectId] : []));
	}
	return [];
};
