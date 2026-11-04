"use client";

import { useMemo } from "react";
import { Filter } from "@repo/types";
import useFindData from "../Apollo/hooks/useFindData";

export type RoleForUser = {
	objectId: string;
	name?: string;
	title?: string;
	color?: string;
};

// Membership is the role relation, not the users embedded on a role (those are capped at 100).
export const roleForUserFilter = (userId: string): Filter => ({
	key: "users",
	id: "users",
	operator: "have",
	value: userId,
	operatorTemplate: "have.objectId.equalTo.value"
});

export const useRoleForUser = (userId?: string, projectId?: string) => {
	const filters = useMemo(
		() => (userId ? [roleForUserFilter(userId)] : []),
		[userId]
	);

	const { data, loading, refetch } = useFindData({
		objectName: "Role",
		fields: ["objectId", "name", "title", "color"],
		filters,
		projectId,
		limit: 1,
		skipQuery: !userId
	});

	return {
		role: data?.[0] as RoleForUser | undefined,
		loading,
		refetch
	};
};
