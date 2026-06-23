"use client";

import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
	PatstoreAppContext,
	useAppContext,
	useFindDataSecure,
	useGetData
} from "@repo/provider";
import { Filter, Module, PatstoreUser } from "@repo/types";
import { isEqual } from "lodash-es";
import { USER_QUERY_FIELDS } from "../constants/user_fields";
import { EmailList } from "../types";

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

export const useListData = (listId: string) => {
	const { project } = useAppContext();
	const { modules } = useContext(PatstoreAppContext);
	const [list, setList] = useState<EmailList | null>(null);
	const [savedList, setSavedList] = useState<EmailList | null>(null);
	const [users, setUsers] = useState<PatstoreUser[]>([]);
	const lastListFetchSignatureRef = useRef<string | null>(null);

	const userModule = useMemo(
		() =>
			modules.find((module) => module.path === "/users") as
				| Module
				| undefined,
		[modules]
	);

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
		data: fetchedList,
		refetch: refetchList,
		loading: listLoading
	} = useGetData({
		objectName: "List",
		fields: ["objectId", "title", "data", "settings", "filters"],
		id: listId
	});

	const {
		data: fetchedUsers,
		refetch: refetchUsers,
		loading: usersLoading
	} = useFindDataSecure({
		objectName: "User",
		fields: USER_QUERY_FIELDS,
		filters: initialUserFilters,
		limit: 5000,
		skip: 0,
		order: "label_ASC",
		useMasterKey: true
	});

	useEffect(() => {
		lastListFetchSignatureRef.current = null;
		setList(null);
		setSavedList(null);
		setUsers([]);
	}, [listId]);

	useEffect(() => {
		if (!fetchedList) {
			return;
		}

		const normalized = normalizeList(fetchedList as EmailList);
		const signature = toFetchSignature(listId, normalized);

		if (lastListFetchSignatureRef.current === signature) {
			return;
		}

		lastListFetchSignatureRef.current = signature;
		setList(normalized);
		setSavedList(normalized);
	}, [fetchedList, listId]);

	useEffect(() => {
		if (!fetchedUsers) {
			return;
		}

		setUsers((prev) => (isEqual(prev, fetchedUsers) ? prev : fetchedUsers));
	}, [fetchedUsers]);

	const onListChange = useCallback(
		(
			update: Partial<EmailList> | ((prev: EmailList) => EmailList)
		) => {
			setList((prev) => {
				if (!prev) {
					return prev;
				}

				const next =
					typeof update === "function"
						? update(prev)
						: { ...prev, ...update };

				return isEqual(prev, next) ? prev : next;
			});
		},
		[]
	);

	const resetList = useCallback(() => {
		setList((prev) => {
			if (!savedList) {
				return prev;
			}

			return isEqual(prev, savedList) ? prev : savedList;
		});
	}, [savedList]);

	const commitList = useCallback((nextList: EmailList) => {
		const signature = toFetchSignature(listId, nextList);
		lastListFetchSignatureRef.current = signature;
		setSavedList(nextList);
		setList(nextList);
	}, [listId]);

	return {
		list,
		savedList,
		onListChange,
		resetList,
		commitList,
		users,
		setUsers,
		refetchList,
		refetchUsers,
		userModule,
		loading: listLoading || usersLoading
	};
};

export default useListData;
