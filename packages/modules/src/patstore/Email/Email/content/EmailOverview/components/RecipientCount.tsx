"use client";

import { FC, useMemo, useState } from "react";
import { IconButton, SlideIn, Table, useCreateColumns } from "@repo/ui";
import { useFindData, useGetData } from "@repo/provider";
import { PatstoreUser, Filter, EmailClass } from "@repo/types";

export interface RecipientCountProps {
	email: EmailClass;
}

const RecipientCount: FC<RecipientCountProps> = ({ email }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [order, setOrder] = useState<string>("name_ASC");

	const recipientListId = email?.settings?.recipient_list;

	console.log("recipientListId", recipientListId);

	console.log("email", email);

	// Fetch the list to get filter settings
	const { data: list } = useGetData({
		objectName: "Item",
		fields: ["objectId", "title", "data", "settings"],
		id: recipientListId
	});

	// Build filters based on list settings
	const filters = useMemo(() => {
		const listFilters: Filter[] = [];
		if (recipientListId) {
			listFilters.push({
				key: "lists",
				value: [recipientListId],
				operator: "in",
				id: "lists"
			});
		}

		return listFilters;
	}, [list]);

	console.log("filters", filters);

	// Fetch users based on list filters
	const {
		data: users,
		refetch,
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
			"lists",
			"emails"
		],
		filters: filters,
		limit: 1000,
		order: order,
		skipQuery: !recipientListId || filters.length === 0
	});

	// Filter users to only those with email or newsletter_email

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
				id: "newsletter_email",
				label: "Newsletter E-Mail",
				type: "string"
			}
		],
		categories: [],
		className: "User",
		refetch,
		useMasterKey: true,
		editDisabled: true
	});

	return (
		<>
			<IconButton
				icon="users"
				onClick={() => setIsOpen(true)}
				type="button"
				text={count?.toString() || "0"}
			/>

			<SlideIn
				isOpen={isOpen}
				cancel={() => setIsOpen(false)}
				confirm={() => setIsOpen(false)}
				header={`Empfänger (${count || 0})`}
				confirmText="Schließen"
				showCancelButton={false}
			>
				<div className="flex col gap-md">
					{!recipientListId ? (
						<p>
							Keine Empfängerliste ausgewählt. Bitte wählen Sie in
							den Einstellungen eine Liste aus.
						</p>
					) : !list ? (
						<p>Lädt Liste...</p>
					) : (
						<>
							<div className="flex col gap-sm">
								<h4>Liste: {list.title}</h4>
								<p>
									{list.settings?.static_list
										? "Statische Liste"
										: "Dynamische Liste"}
								</p>
							</div>

							{users.length > 0 ? (
								<Table
									columns={columns}
									data={users}
									rowCount={count}
									setOrder={setOrder}
								/>
							) : (
								<p>
									Keine Empfänger gefunden, die die
									Filterbedingungen erfüllen.
								</p>
							)}
						</>
					)}
				</div>
			</SlideIn>
		</>
	);
};

export default RecipientCount;
