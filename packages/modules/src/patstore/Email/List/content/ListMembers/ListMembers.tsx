"use client";

import { FC, useMemo, useState } from "react";
import { useAppContext, useDataHandler, useFindData } from "@repo/provider";
import { IconButton, Table, TextInput, useCreateColumns } from "@repo/ui";
import { ApolloRefetch, Filter, PatstoreUser } from "@repo/types";
import MemberSwitch from "./components/MemberSwitch";

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

	const [loading, setLoading] = useState(false);

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

	const [filters, setFilters] = useState<Filter[]>([]);

	// Fetch users with email addresses
	const {
		data: users,
		refetch: refetchUsers,
		count
	} = useFindData({
		objectName: "User",
		fields: [
			"objectId",
			"username",
			"title",
			"pre_title",
			"post_title",
			"email",
			"first_name",
			"last_name",
			"data",
			"settings",
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

	// Get currently selected recipients from list
	const selectedRecipients = useMemo(() => {
		return users.filter((user: PatstoreUser) =>
			user?.lists?.includes(listId)
		);
	}, [users, listId]);

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
					return (
						<MemberSwitch
							listId={listId}
							lists={row.lists}
							userId={row.objectId}
							refetch={refetchUsers}
						/>
					);
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
			<div className="flex row a-ce j-sb gap-sm w-100">
				<div className="flex col a-st w-100">
					<IconButton
						icon="check"
						onClick={async () => {
							setLoading(true);
							users.forEach(async (user: PatstoreUser) => {
								if (user.lists?.includes(listId)) {
									return;
								}
								await updateData({
									className: "_User",
									objectId: user.objectId,
									updateObject: {
										lists: [...(user.lists || []), listId]
									}
								});
							});
							await refetchUsers();
							setLoading(false);
						}}
						text="Alle auswählen"
						loading={loading}
					/>
					<p>
						Ausgewählte Mitglieder: {selectedRecipients.length} /{" "}
						{count || 0}
					</p>
				</div>
				<div className="flex col a-st gap-sm">
					<TextInput
						label="Nach Vor- oder Nachname filtern"
						id="search-filter"
						defaultValue={""}
						onChange={(e) =>
							setFilters([
								{
									key: "label",
									value: e,
									operator: "matchesRegex",
									id: "label"
								}
							])
						}
						placeholder="Name eingeben..."
						disabled={loading}
					/>
				</div>
			</div>
			<Table
				columns={columns}
				data={users || []}
				rowCount={users.length}
				setOrder={setOrder}
			/>
		</div>
	);
};

export default ListMembers;
