"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAppContext, useFindDataSecure, useGetData } from "@repo/provider";
import { Filter, PatstoreUser } from "@repo/types";
import { isEqual } from "lodash-es";
import { USER_QUERY_FIELDS } from "../../List/constants/user_fields";
import { EmailList } from "../../List/types";
import { buildEmailRecipientsFromUsers } from "../functions/buildEmailRecipientsFromUsers";
import { EmailRecipient } from "../types";

const normalizeList = (fetchedList: EmailList): EmailList => ({
	objectId: fetchedList.objectId,
	title: fetchedList.title || "",
	data: fetchedList.data,
	settings: fetchedList.settings || { static_list: true },
	filters:
		fetchedList.filters ||
		fetchedList.settings?.filters ||
		[]
});

const toFetchSignature = (listId: string, list: EmailList) =>
	`${listId}:${JSON.stringify(list)}`;

export const useEmailRecipients = (recipientListId?: string) => {
	const { project } = useAppContext();
	const [users, setUsers] = useState<PatstoreUser[]>([]);
	const [list, setList] = useState<EmailList | null>(null);
	const lastListFetchSignatureRef = useRef<string | null>(null);

	const initialUserFilters: Filter[] = useMemo(
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

	const {
		data: fetchedUsers,
		loading: usersLoading,
		refetch: refetchUsers
	} = useFindDataSecure({
		objectName: "User",
		fields: USER_QUERY_FIELDS,
		filters: initialUserFilters,
		limit: 5000,
		skip: 0,
		order: "label_ASC",
		useMasterKey: true
	});

	const {
		data: fetchedList,
		loading: listLoading,
		refetch: refetchList
	} = useGetData({
		objectName: "List",
		fields: ["objectId", "title", "data", "settings", "filters"],
		id: recipientListId,
		skip: !recipientListId
	});

	useEffect(() => {
		if (!fetchedUsers) {
			return;
		}

		setUsers((prev) => (isEqual(prev, fetchedUsers) ? prev : fetchedUsers));
	}, [fetchedUsers]);

	useEffect(() => {
		lastListFetchSignatureRef.current = null;
		setList(null);
	}, [recipientListId]);

	useEffect(() => {
		if (!fetchedList || !recipientListId) {
			return;
		}

		const normalized = normalizeList(fetchedList as EmailList);
		const signature = toFetchSignature(recipientListId, normalized);

		if (lastListFetchSignatureRef.current === signature) {
			return;
		}

		lastListFetchSignatureRef.current = signature;
		setList(normalized);
	}, [fetchedList, recipientListId]);

	const { recipients, suppressedRecipients } = useMemo((): {
		recipients: EmailRecipient[];
		suppressedRecipients: EmailRecipient[];
	} => {
		if (!list || !recipientListId) {
			return { recipients: [], suppressedRecipients: [] };
		}

		return buildEmailRecipientsFromUsers(list, users);
	}, [list, users, recipientListId]);

	const refetch = async () => {
		await refetchUsers();
		if (recipientListId) {
			await refetchList();
		}
	};

	return {
		recipients,
		suppressedRecipients,
		list,
		users,
		loading: usersLoading || (!!recipientListId && listLoading),
		refetch
	};
};

export default useEmailRecipients;
