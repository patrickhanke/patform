import { Filter } from "@repo/types";
import { roleMemberIds } from "@repo/provider";

// The user module field id. Saved list filters store the selected role ids under this key.
export const ROLE_MEMBERSHIP_FILTER_KEY = "roles";

// Matches no user. An empty `in` list is dropped by the query builder and would return everyone.
const EMPTY_MATCH = "__none__";

export const roleIdsFromFilters = (filters: Filter[]): string[] => {
	const ids = filters.flatMap((filter) => {
		if (filter.key !== ROLE_MEMBERSHIP_FILTER_KEY || filter.value == null) {
			return [];
		}
		if (Array.isArray(filter.value)) {
			return filter.value.filter(
				(item): item is string => typeof item === "string" && item.length > 0
			);
		}
		if (typeof filter.value === "string" && filter.value.length > 0) {
			return [filter.value];
		}
		return [];
	});

	return [...new Set(ids)];
};

export const memberIdsFromRoles = (
	roles: { users?: Parameters<typeof roleMemberIds>[0] }[]
): string[] => [
	...new Set(roles.flatMap((role) => roleMemberIds(role.users)))
];

// Replaces a `roles` filter with the users that belong to those roles.
export const filtersWithRoleMembership = (
	filters: Filter[],
	memberIds: string[]
): Filter[] => {
	const rest = filters.filter(
		(filter) => filter.key !== ROLE_MEMBERSHIP_FILTER_KEY
	);
	const objectIdFilter = rest.find(
		(filter) =>
			filter.key === "objectId" &&
			filter.operator === "in" &&
			Array.isArray(filter.value)
	);
	const allowed = objectIdFilter
		? memberIds.filter((id) =>
				(objectIdFilter.value as string[]).includes(id)
			)
		: memberIds;
	const withoutObjectId = objectIdFilter
		? rest.filter((filter) => filter !== objectIdFilter)
		: rest;

	return [
		...withoutObjectId,
		{
			key: "objectId",
			operator: "in",
			value: allowed.length > 0 ? allowed : [EMPTY_MATCH]
		}
	];
};
