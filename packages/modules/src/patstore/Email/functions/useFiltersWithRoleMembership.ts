"use client";

import { useMemo } from "react";
import { useFindDataSecure } from "@repo/provider";
import { Filter } from "@repo/types";
import {
	filtersWithRoleMembership,
	memberIdsFromRoles,
	roleIdsFromFilters
} from "./resolveRoleFilters";

const ROLE_USERS_FIELD =
	"users(first: 5000) { edges { node { objectId } } }";

// Turns a saved `roles` list filter into an objectId filter for the members of those roles.
export const useFiltersWithRoleMembership = (
	filters: Filter[],
	projectId?: string
) => {
	const roleIds = useMemo(() => roleIdsFromFilters(filters), [filters]);
	const roleQueryFilters = useMemo<Filter[]>(
		() => [{ key: "objectId", operator: "in", value: roleIds }],
		[roleIds]
	);

	const { data: roles, loading } = useFindDataSecure({
		objectName: "Role",
		fields: ["objectId", ROLE_USERS_FIELD],
		filters: roleQueryFilters,
		projectId,
		limit: Math.max(roleIds.length, 1),
		skipQuery: roleIds.length === 0
	});

	const ready = roleIds.length === 0 || !loading;
	const resolvedFilters = useMemo(() => {
		if (!ready || roleIds.length === 0) {
			return filters;
		}
		return filtersWithRoleMembership(filters, memberIdsFromRoles(roles ?? []));
	}, [filters, ready, roleIds, roles]);

	return { filters: resolvedFilters, ready };
};
