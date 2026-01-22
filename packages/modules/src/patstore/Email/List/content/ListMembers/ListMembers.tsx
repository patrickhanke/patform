"use client";

import { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
	useAppContext,
	useDataHandler,
	useFindData,
	useGetData
} from "@repo/provider";
import { IconButton, Table, useCreateColumns } from "@repo/ui";
import { ApolloRefetch, Filter, PatstoreUser } from "@repo/types";
import { generateUUID } from "../../functions/generateUUID";

export interface ListMembersProps {
	listId: string;
	refetch: ApolloRefetch;
}

export interface RecipientData {
	name: string;
	email: string;
	key: string;
}

const ListMembers: FC<ListMembersProps> = ({ listId, refetch }) => {
	const { project } = useAppContext();
	const { updateData } = useDataHandler();
	const [order, setOrder] = useState<string>("name_ASC");

	const { data: list, refetch: refetchList } = useGetData({
		objectName: "Item",
		fields: ["objectId", "data"],
		id: listId
	});

	const initialFilters: Filter[] = useMemo(
		() => [
			{
				key: "projects",
				value: [project.objectId],
				operator: "in",
				id: "projects"
			}
		],
		[project]
	);

	const [filters] = useState<Filter[]>([]);

	// Fetch users with email addresses
	const {
		data: users,
		refetch: refetchUsers,
		count
	} = useFindData({
		objectName: "User",
		fields: [
			"objectId",
			"name",
			"username",
			"title",
			"pre_title",
			"post_title",
			"email",
			"first_name",
			"last_name",
			"data",
			"settings",
			"newsletter_email",
			"lists"
		],
		filters: [...initialFilters, ...filters] as Filter[],
		limit: 1000,
		skip: 0,
		order: order
	});

	console.log(
		"users",
		users.filter((user: PatstoreUser) => user.lists)
	);
	console.log(
		"listUsers",
		users.filter((user: PatstoreUser) => user?.lists?.includes(listId))
	);

	// Filter users to only those with email or newsletter_email
	const usersWithEmail = useMemo(() => {
		if (!users) return [];
		return users.filter((user: PatstoreUser) => {
			const hasEmail = user.email && user.email.trim() !== "";
			const hasNewsletterEmail =
				user.settings?.newsletter_email &&
				typeof user.settings.newsletter_email === "string" &&
				user.settings.newsletter_email.trim() !== "";
			return hasEmail || hasNewsletterEmail;
		});
	}, [users]);

	// Get currently selected recipients from list
	const selectedRecipients = useMemo(() => {
		return (list?.data?.recipients || []) as RecipientData[];
	}, [list]);

	// Track selected user IDs
	const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

	// Update selected user IDs when list recipients change (on initial load)
	useEffect(() => {
		if (selectedRecipients.length > 0 && usersWithEmail.length > 0) {
			const recipientEmails = selectedRecipients.map((r) => r.email);
			const ids = usersWithEmail
				.filter((user: PatstoreUser) => {
					const email =
						user.email ||
						(user.settings?.newsletter_email as string);
					return recipientEmails.includes(email);
				})
				.map((user: PatstoreUser) => user.objectId);

			// Only update if the ids have actually changed
			if (
				JSON.stringify(ids.sort()) !==
				JSON.stringify(selectedUserIds.sort())
			) {
				setSelectedUserIds(ids);
			}
		} else if (
			selectedRecipients.length === 0 &&
			selectedUserIds.length > 0
		) {
			setSelectedUserIds([]);
		}
	}, [selectedRecipients, usersWithEmail]);

	// Save selected users to list.data.recipients
	const saveRecipients = useCallback(
		async (userIds: string[]) => {
			if (!usersWithEmail) return;

			const recipients: RecipientData[] = usersWithEmail
				.filter((user: PatstoreUser) => userIds.includes(user.objectId))
				.map((user: PatstoreUser) => ({
					name:
						user.name ||
						`${user.first_name || ""} ${user.last_name || ""}`.trim() ||
						user.username,
					email:
						user.email ||
						(user.settings?.newsletter_email as string) ||
						"",
					key: generateUUID()
				}));

			await updateData({
				className: "Item",
				objectId: listId,
				updateObject: {
					data: {
						...list?.data,
						recipients
					}
				},
				feedback: "Mitglieder erfolgreich aktualisiert"
			});

			await refetchList();
		},
		[usersWithEmail, listId, updateData, refetchList, list?.data]
	);

	// Handle row selection
	const handleRowSelection = useCallback(
		(value: React.SetStateAction<string[]>) => {
			const selectedRows =
				typeof value === "function" ? value(selectedUserIds) : value;
			setSelectedUserIds(selectedRows);
			saveRecipients(selectedRows);
			refetch();
		},
		[selectedUserIds, saveRecipients, refetch]
	);

	// Generate columns for the table
	const columns = useCreateColumns<PatstoreUser>({
		data: [
			{
				id: "title",
				label: "Anrede",
				type: "string"
			},
			{
				id: "pre_title",
				label: "Titel",
				type: "string"
			},
			{
				id: "first_name",
				label: "Vorname",
				type: "string"
			},
			{
				id: "last_name",
				label: "Nachname",
				type: "string"
			},
			{
				id: "lists",
				label: "In dieser Liste",
				type: "custom",
				render: (row: PatstoreUser) => {
					const hasList = row?.lists?.includes(listId);
					return <div>{hasList ? "Ja" : "Nein"}</div>;
				}
			}
		],
		categories: [],
		className: "User",
		refetch,
		useMasterKey: true,
		editDisabled: true
	});

	return (
		<div>
			<div style={{ marginBottom: "1rem" }}>
				<IconButton
					icon="check"
					onClick={() => {
						console.log("Alle auswählen");
					}}
					text="Alle auswählen"
				/>
				<p>
					Ausgewählte Mitglieder: {selectedRecipients.length} /{" "}
					{count || 0}
				</p>
			</div>
			<Table
				columns={columns}
				data={users || []}
				rowCount={count}
				setOrder={setOrder}
				setSelectedRows={handleRowSelection}
			/>
		</div>
	);
};

export default ListMembers;
