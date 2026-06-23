"use client";

import { FC, useState } from "react";
import { IconButton, SlideIn, Table, useCreateColumns } from "@repo/ui";
import { RecipientCountProps } from "../types";

const RecipientCount: FC<RecipientCountProps> = ({
	email,
	recipients,
	suppressedRecipients
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const recipientListId = email?.settings?.recipient_list;

	const columns = useCreateColumns({
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
		refetch: () => null,
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
					) : recipients.length > 0 ? (
						<>
							{suppressedRecipients.length > 0 && (
								<p>
									{suppressedRecipients.length} Empfänger sind
									unterdrückt und nicht enthalten.
								</p>
							)}
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
						</>
					) : (
						<p>
							Keine Empfänger gefunden, die die Filterbedingungen
							erfüllen.
						</p>
					)}
				</div>
			</SlideIn>
		</>
	);
};

export default RecipientCount;
