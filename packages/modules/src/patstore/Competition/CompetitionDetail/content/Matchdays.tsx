"use client";

import { FC, useMemo, useState } from "react";
import {
	ColumnDef,
	CreateButton,
	IconButton,
	Select,
	Table,
	TextInput
} from "@repo/ui";
import { CompetitionMatchday } from "@repo/types";
import { CompetitionTabProps } from "../types";
import { createMatchday } from "../functions/factories";
import { selectString } from "../functions/selectValue";

const Matchdays: FC<CompetitionTabProps> = ({
	Competition,
	related,
	onUpdate,
	loading
}) => {
	const [draft, setDraft] = useState<CompetitionMatchday>(createMatchday());

	const eventOptions = related.events.map((event) => ({
		value: event.objectId,
		label: event.title
	}));
	const clubOptions = related.clubs.map((club) => ({
		value: club.objectId,
		label: club.title
	}));

	const columns: ColumnDef<CompetitionMatchday>[] = useMemo(
		() => [
			{
				accessorFn: (row) => row.spieltagNr,
				header: () => <span>Nr.</span>,
				id: "spieltagNr",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) =>
					related.events.find(
						(event) => event.objectId === row.eventId
					)?.title || "—",
				header: () => <span>Event</span>,
				id: "eventId",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => row.felder,
				header: () => <span>Felder</span>,
				id: "felder",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) =>
					related.clubs.find(
						(club) => club.objectId === row.hostEntryId
					)?.title || "—",
				header: () => <span>Ausrichter</span>,
				id: "hostEntryId",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => (
					<IconButton
						icon="delete"
						disabled={loading}
						onClick={() =>
							onUpdate(
								{
									matchdays: Competition.matchdays.filter(
										(item) => item.id !== row.id
									)
								},
								"Spieltag entfernt"
							)
						}
					/>
				),
				header: () => <span></span>,
				id: "actions",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			}
		],
		[
			Competition.matchdays,
			loading,
			onUpdate,
			related.clubs,
			related.events
		]
	);

	const addMatchday = async () => {
		if (!draft.eventId) {
			return;
		}
		await onUpdate(
			{
				matchdays: [
					...Competition.matchdays,
					{
						...draft,
						spieltagNr:
							draft.spieltagNr ||
							Competition.matchdays.length + 1
					}
				]
			},
			"Spieltag hinzugefügt"
		);
		setDraft(
			createMatchday({
				spieltagNr: Competition.matchdays.length + 2
			})
		);
	};

	return (
		<div className="flex col a-st gap-sm">
			<p>
				Spieltage verweisen auf bestehende Events. Spieltag-Nummer,
				Felder und Ausrichter (Verein) liegen auf der Meisterschaft.
			</p>
			<div className="flex row a-ce gap-sm" style={{ flexWrap: "wrap" }}>
				<TextInput
					id="spieltagNr"
					type="number"
					label="Nummer"
					defaultValue={draft.spieltagNr}
					onChange={(value) =>
						setDraft((current) => ({
							...current,
							spieltagNr: Number(value) || 1
						}))
					}
				/>
				<Select
					id="eventId"
					label="Event"
					options={eventOptions}
					value={
						eventOptions.find(
							(option) => option.value === draft.eventId
						) || null
					}
					onChange={(option) =>
						setDraft((current) => ({
							...current,
							eventId: selectString(option)
						}))
					}
				/>
				<TextInput
					id="felder"
					type="number"
					label="Felder"
					defaultValue={draft.felder}
					onChange={(value) =>
						setDraft((current) => ({
							...current,
							felder: Number(value) || 1
						}))
					}
				/>
				<Select
					id="hostEntryId"
					label="Ausrichter"
					isClearable
					options={clubOptions}
					value={
						clubOptions.find(
							(option) => option.value === draft.hostEntryId
						) || null
					}
					onChange={(option) =>
						setDraft((current) => ({
							...current,
							hostEntryId: selectString(option) || undefined
						}))
					}
				/>
				<CreateButton
					text="Spieltag hinzufügen"
					size="small"
					disabled={loading || !draft.eventId}
					onClick={addMatchday}
				/>
			</div>
			<Table
				columns={columns}
				data={[...Competition.matchdays].sort(
					(a, b) => a.spieltagNr - b.spieltagNr
				)}
				rowIdResolver={(row) => (row as CompetitionMatchday).id}
			/>
		</div>
	);
};

export default Matchdays;
