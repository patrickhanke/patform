"use client";

import { FC, useMemo, useState } from "react";
import { ClubClass, PersonClass } from "@repo/types";
import {
	ColumnDef,
	CreateButton,
	IconButton,
	Select,
	SlideIn,
	Table,
	TextInput,
	usePageData
} from "@repo/ui";
import { useDataHandlerSecure } from "@repo/provider";
import { ClubTabProps } from "../types";
import { personName, personOptions } from "../functions/personName";

const Players: FC<ClubTabProps> = ({ related }) => {
	const { data: club, setData } = usePageData<ClubClass>();
	const { createData, loading } = useDataHandlerSecure();
	const [addOpen, setAddOpen] = useState(false);
	const [existingId, setExistingId] = useState("");
	const [createOpen, setCreateOpen] = useState(false);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");

	const playerIds = club?.playerIds || [];
	const players = related.people.filter((person) =>
		playerIds.includes(person.objectId)
	);
	const availablePeople = related.people.filter(
		(person) => !playerIds.includes(person.objectId)
	);
	const availableOptions = personOptions(availablePeople);

	const columns: ColumnDef<PersonClass>[] = useMemo(
		() => [
			{
				accessorFn: (row) => personName(row),
				header: () => <span>Name</span>,
				id: "name",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => row.email || "—",
				header: () => <span>E-Mail</span>,
				id: "email",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => (
					<IconButton
						icon="delete"
						color="secondary"
						onClick={() =>
							setData(
								"playerIds",
								playerIds.filter((id) => id !== row.objectId)
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
		[playerIds, setData]
	);

	if (!club) {
		return null;
	}

	return (
		<div className="flex col a-st gap-sm">
			<div className="flex row a-ce gap-sm" style={{ flexWrap: "wrap" }}>
				<CreateButton
					text="Spieler*in zuordnen"
					size="small"
					onClick={() => setAddOpen(true)}
				/>
				<CreateButton
					text="Spieler*in erstellen"
					size="small"
					onClick={() => setCreateOpen(true)}
				/>
			</div>
			<Table columns={columns} data={players} />
			<SlideIn
				header="Spieler*in zuordnen"
				isOpen={addOpen}
				cancel={() => setAddOpen(false)}
				confirm={() => {
					if (!existingId) {
						return;
					}
					setData("playerIds", [...playerIds, existingId]);
					setExistingId("");
					setAddOpen(false);
				}}
				confirmText="Zuordnen"
				disabled={[false, !existingId]}
			>
				<Select
					id="existing-player"
					label="Person"
					options={availableOptions}
					value={
						availableOptions.find(
							(option) => option.value === existingId
						) || null
					}
					onChange={(option) =>
						setExistingId(
							option?.value == null ? "" : String(option.value)
						)
					}
				/>
			</SlideIn>
			<SlideIn
				header="Person erstellen"
				isOpen={createOpen}
				cancel={() => setCreateOpen(false)}
				confirm={async () => {
					if (!name) {
						return;
					}
					await createData({
						className: "Person",
						updateObject: {
							title: name,
							name,
							email
						},
						feedback: "Neue Person angelegt",
						afterSaveHandler: (result: { objectId?: string }) => {
							if (result?.objectId) {
								setData("playerIds", [
									...playerIds,
									result.objectId
								]);
							}
						}
					});
					await related.refetchPeople();
					setName("");
					setEmail("");
					setCreateOpen(false);
				}}
				confirmText="Erstellen"
				disabled={[false, !name || loading]}
				loading={loading}
			>
				<div className="flex col a-st gap-sm">
					<TextInput
						id="new-person-name"
						label="Name"
						defaultValue={name}
						onChange={setName}
					/>
					<TextInput
						id="new-person-email"
						label="E-Mail"
						defaultValue={email}
						onChange={setEmail}
					/>
				</div>
			</SlideIn>
		</div>
	);
};

export default Players;
