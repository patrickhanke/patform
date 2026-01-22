"use client";

import { FC, useMemo, useState } from "react";
import { IconButton, SlideIn, Table, useCreateColumns } from "@repo/ui";
import { useFindData, useGetData } from "@repo/provider";
import { PatstoreUser, Filter, EmailClass } from "@repo/types";
import { RecipientData } from "../../EmaiRecipients";

export interface RecipientCountProps {
	email: EmailClass;
	projectId: string;
}

const RecipientCount: FC<RecipientCountProps> = ({ email, projectId }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [order, setOrder] = useState<string>("name_ASC");

	const recipientListId = email?.settings?.recipient_list;

	console.log("email", email);

	// Fetch the list to get filter settings
	const { data: list } = useGetData({
		objectName: "Item",
		fields: ["objectId", "title", "data", "settings"],
		id: recipientListId
	});

	// Build filters based on list settings
	const filters = useMemo(() => {
		console.log("list", list);
		if (!list?.settings) return [];

		const listFilters: Filter[] = [];

		if (list.settings.static_list) {
			const recipients = list.data?.recipients || [];
			if (recipients.length > 0) {
				const emails = recipients.map((r: RecipientData) => r.email);
				listFilters.push({
					key: "email",
					value: emails,
					operator: "in",
					id: "email_filter"
				});
			}
		} else {
			// Handle dynamic list - use dynamic filters
			const dynamicFilters = list.settings.filters || [];

			dynamicFilters.forEach(
				(filter: { key: string; value: string }, index: number) => {
					if (filter.key && filter.value !== undefined) {
						listFilters.push({
							key: filter.key,
							value: filter.value,
							operator: "equalTo",
							id: `dynamic_filter_${index}`
						});
					}
				}
			);
		}

		// Always add newsletter_optin filter
		// listFilters.push({
		// 	key: "newsletter_optin",
		// 	value: true,
		// 	operator: "equalTo",
		// 	id: "newsletter_optin"
		// });

		return listFilters;
	}, [list]);

	console.log("filters", filters);

	// Determine if we should fetch users
	const shouldFetchUsers = recipientListId && filters.length > 0;

	console.log("shouldFetchUsers", shouldFetchUsers);

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
			"newsletter_email"
		],
		filters: filters,
		limit: shouldFetchUsers ? 1000 : 0,
		projectId: projectId,
		skip: 0,
		order: order
	});

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

							{usersWithEmail.length > 0 ? (
								<Table
									columns={columns}
									data={usersWithEmail}
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
