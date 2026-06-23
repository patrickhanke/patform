"use client";

import { FC, useMemo, useState } from "react";
import { Table, TextInput, useCreateColumns } from "@repo/ui";
import { ApolloRefetch, PatstoreUser } from "@repo/types";
import getListMembers from "../../functions/getListMembers";
import { EmailList } from "../../types";

export interface ListMembersProps {
	list: EmailList;
	users: PatstoreUser[];
	refetchUsers: () => Promise<unknown>;
	disabled?: boolean;
}

export interface RecipientData {
	name: string;
	email: string;
	key: string;
}

const ListMembers: FC<ListMembersProps> = ({
	list,
	users,
	refetchUsers,
	disabled = false
}) => {
	const listId = list.objectId;
	const [order, setOrder] = useState<string>("label_ASC");
	const [searchTerm, setSearchTerm] = useState("");

	const listMembers = useMemo(
		() => getListMembers(list, users, listId),
		[list, users, listId]
	);

	const filteredUsers = useMemo(() => {
		if (!searchTerm.trim()) {
			return listMembers;
		}

		const term = searchTerm.trim().toLowerCase();
		return listMembers.filter((user) => {
			const label = user.label?.toLowerCase() || "";
			const firstName = user.first_name?.toLowerCase() || "";
			const lastName = user.last_name?.toLowerCase() || "";

			return (
				label.includes(term) ||
				firstName.includes(term) ||
				lastName.includes(term)
			);
		});
	}, [listMembers, searchTerm]);

	const sortedUsers = useMemo(() => {
		const [field, direction] = order.split("_");
		const sorted = [...filteredUsers];

		sorted.sort((a, b) => {
			const aValue = String(a[field as keyof PatstoreUser] ?? "");
			const bValue = String(b[field as keyof PatstoreUser] ?? "");
			const comparison = aValue.localeCompare(bValue, "de");

			return direction === "DESC" ? -comparison : comparison;
		});

		return sorted;
	}, [filteredUsers, order]);

	const columns = useCreateColumns<PatstoreUser>({
		data: [
			{
				id: "title",
				label: "Anrede",
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
			}
		],
		categories: [],
		className: "User",
		refetch: refetchUsers as ApolloRefetch,
		useMasterKey: true,
		editDisabled: true
	});

	return (
		<div>
			<div className="flex row a-ce j-sb gap-sm w-100">
				<div className="flex col a-st w-100">
					<p>Mitglieder: {listMembers.length}</p>
				</div>
				<div className="flex col a-st gap-sm">
					<TextInput
						label="Nach Vor- oder Nachname filtern"
						id="search-filter"
						defaultValue={searchTerm}
						onChange={(value) => setSearchTerm(String(value))}
						placeholder="Name eingeben..."
						disabled={disabled}
					/>
				</div>
			</div>
			<Table
				columns={columns}
				data={sortedUsers}
				rowCount={sortedUsers.length}
				setOrder={setOrder}
			/>
		</div>
	);
};

export default ListMembers;
