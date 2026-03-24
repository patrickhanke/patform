"use client";

import { FC, useEffect, useState } from "react";
import { IconButton, SlideIn, Table, useCreateColumns } from "@repo/ui";
import { useGetData } from "@repo/provider";
import { PatstoreUser } from "@repo/types";
import { RecipientCountProps } from "../types";

const RecipientCount: FC<RecipientCountProps> = ({
	email,
	recipients,
	suppressedRecipients,
	findRecipients
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const recipientListId = email?.settings?.recipient_list;

	// Fetch the list to get filter settings
	const { data: list } = useGetData({
		objectName: "Item",
		fields: ["objectId", "title", "data", "settings"],
		id: recipientListId
	});

	console.log("recipients", recipients);

	useEffect(() => {
		if (recipientListId) {
			findRecipients();
		}
	}, [recipientListId]);

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
			}
		],
		categories: [],
		className: "User",
		refetch: findRecipients,
		useMasterKey: true,
		editDisabled: true
	});

	return (
		<>
			<IconButton
				icon="users"
				onClick={() => setIsOpen(true)}
				type="button"
				text={recipients.length?.toString() || "0"}
			/>

			<SlideIn
				isOpen={isOpen}
				cancel={() => setIsOpen(false)}
				confirm={() => setIsOpen(false)}
				header={`Empfänger (${recipients.length || 0})`}
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

							{recipients.length > 0 ? (
								<Table
									columns={columns}
									data={recipients.map((recipient) => ({
										...recipient,
										title: recipient.data?.title,
										pre_title: recipient.data?.pre_title,
										first_name: recipient.data?.first_name,
										last_name: recipient.data?.last_name,
										email: recipient.email
									}))}
									rowCount={recipients.length}
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
