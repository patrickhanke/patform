"use client";

import { useMemo } from "react";
import { useAppContext, useFindDataSecure, useGetData } from "@repo/provider";
import { EmailList, Filter } from "@repo/types";
import { buildEmailRecipientsFromUsers } from "../functions/buildEmailRecipientsFromUsers";
import { buildUserFiltersFromList } from "../functions/buildUserFiltersFromList";
import { useFiltersWithRoleMembership } from "../../functions/useFiltersWithRoleMembership";
import { resolveRecipientListId } from "../functions/resolveRecipientListId";
import { EmailRecipient } from "../types";

const EMPTY_FILTERS: Filter[] = [];

const EMPTY_RECIPIENTS: {
	recipients: EmailRecipient[];
	suppressedRecipients: EmailRecipient[];
} = {
	recipients: [],
	suppressedRecipients: []
};

export const useEmailRecipients = (recipientListId?: unknown) => {
	const { project } = useAppContext();
	const listId = resolveRecipientListId(recipientListId);

	const baseFilters = useMemo<Filter[]>(
		() => [
			{
				key: "projects",
				value: [project.objectId],
				operator: "in",
				id: "projects"
			},
			{
				key: "is_superuser",
				value: true,
				operator: "notEqualTo",
				id: "is_superuser"
			}
		],
		[project.objectId]
	);

	const { data: list, loading: listLoading } = useGetData<EmailList>({
		objectName: "Email",
		fields: ["objectId", "title", "data", "settings"],
		id: listId,
		skip: !listId
	});

	const listReady = Boolean(listId && list?.objectId === listId);

	const userFilters = useMemo(() => {
		if (!listReady || !list) {
			return null;
		}

		return buildUserFiltersFromList(list, baseFilters);
	}, [baseFilters, list, listReady]);

	const { filters: resolvedFilters, ready: rolesReady } =
		useFiltersWithRoleMembership(
			userFilters ?? EMPTY_FILTERS,
			project.objectId
		);

	const skipUsersQuery = !listReady || userFilters === null || !rolesReady;

	const { data: users, loading: usersLoading } = useFindDataSecure({
		objectName: "User",
		fields: [
			"objectId",
			"type",
			"label",
			"email",
			"data",
			"first_name",
			"last_name",
			"title",
			"emails",
			"settings"
		],
		filters: resolvedFilters,
		limit: 5000,
		skip: 0,
		order: "label_ASC",
		useMasterKey: true,
		skipQuery: skipUsersQuery
	});

	const { recipients, suppressedRecipients } = useMemo((): {
		recipients: EmailRecipient[];
		suppressedRecipients: EmailRecipient[];
	} => {
		if (
			!listReady ||
			!list ||
			userFilters === null ||
			!rolesReady ||
			usersLoading
		) {
			return EMPTY_RECIPIENTS;
		}

		return buildEmailRecipientsFromUsers(list, users || []);
	}, [list, listReady, rolesReady, userFilters, users, usersLoading]);

	return {
		recipients,
		suppressedRecipients,
		list,
		loading:
			!!listId &&
			(listLoading ||
				!listReady ||
				(userFilters !== null && (!rolesReady || usersLoading)))
	};
};

export default useEmailRecipients;
