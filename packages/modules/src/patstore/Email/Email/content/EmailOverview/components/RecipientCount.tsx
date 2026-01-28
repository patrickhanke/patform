"use client";

import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { IconButton, SlideIn, Table, useCreateColumns } from "@repo/ui";
import { axiosclient, useGetData } from "@repo/provider";
import { PatstoreUser, Filter, EmailClass, EmailRecipient } from "@repo/types";

export interface RecipientCountProps {
	email: EmailClass;
}

const RecipientCount: FC<RecipientCountProps> = ({ email }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [recipients, setRecipients] = useState<EmailRecipient[]>([]);
	const recipientListId = email?.settings?.recipient_list;

	console.log("recipientListId", recipientListId);

	console.log("email", email);

	// Fetch the list to get filter settings
	const { data: list } = useGetData({
		objectName: "Item",
		fields: ["objectId", "title", "data", "settings"],
		id: recipientListId
	});

	const findRecipients = useCallback(async () => {
		const response = await axiosclient().post(
			"functions/get_list_recipients",
			{
				list_id: recipientListId
			}
		);
		console.log("response", response.data);

		setRecipients(response.data.result);
	}, [recipientListId]);

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
									data={recipients}
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
