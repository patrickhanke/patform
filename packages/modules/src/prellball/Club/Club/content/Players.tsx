"use client";

import { FC, useMemo, useState } from "react";
import { ColumnDef, CreateButton, SlideIn, Table, TextInput } from "@repo/ui";
import { ErrorMessage, PersonClass } from "@repo/types";
import { useDataHandlerSecure } from "@repo/provider";
import { readPersonData } from "../../../Championship/functions/person";
import { toDateInput } from "../../../Championship/functions/dates";

const Players: FC<{
	clubId: string;
	people: PersonClass[];
	refetchPeople: () => Promise<unknown>;
}> = ({ clubId, people, refetchPeople }) => {
	const { createData } = useDataHandlerSecure();
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [dtbId, setDtbId] = useState("");
	const [birthDate, setBirthDate] = useState("");

	const clubPlayers = people.filter((person) =>
		(person.categories || []).includes(clubId)
	);

	const errors = useMemo(() => {
		const next: ErrorMessage[] = [];
		const trimmed = name.trim();
		if (!trimmed) {
			next.push({
				id: "name",
				key: "name",
				message: "Ein Name muss angegeben werden."
			});
		}
		if (
			trimmed &&
			people.some(
				(person) =>
					(person.name || person.label || "").trim().toLowerCase() ===
					trimmed.toLowerCase()
			)
		) {
			next.push({
				id: "name-exists",
				key: "name",
				message:
					"Dieser Name existiert bereits. Falls der Spieler diesem Verein zugehörig sein sollte, wenden Sie sich an die Staffelleitung."
			});
		}
		if (dtbId && dtbId.length !== 10) {
			next.push({
				id: "dtb-length",
				key: "dtb",
				message: "Die DTB-ID muss genau 10 Stellen lang sein."
			});
		}
		if (
			dtbId.length === 10 &&
			people.some((person) => readPersonData(person).dtb_id === dtbId)
		) {
			next.push({
				id: "dtb-exists",
				key: "dtb",
				message:
					"Diese DTB-ID ist bereits vergeben. Falls der Spieler diesem Verein zugehörig sein sollte, wenden Sie sich an die Staffelleitung."
			});
		}
		return next;
	}, [dtbId, name, people]);

	const columns: ColumnDef<PersonClass>[] = [
		{
			id: "name",
			header: () => <span>Name</span>,
			accessorFn: (row) => row.name || row.label,
			cell: (info) => info.getValue(),
			footer: (info) => info.column.id
		},
		{
			id: "dtb",
			header: () => <span>DTB-ID</span>,
			accessorFn: (row) => readPersonData(row).dtb_id || "—",
			cell: (info) => info.getValue(),
			footer: (info) => info.column.id
		},
		{
			id: "birth",
			header: () => <span>Geburtstag</span>,
			accessorFn: (row) =>
				toDateInput(readPersonData(row).birth_date) || "—",
			cell: (info) => info.getValue(),
			footer: (info) => info.column.id
		}
	];

	const createPlayer = async () => {
		if (errors.length > 0) return;
		await createData({
			className: "Person",
			updateObject: {
				name: name.trim(),
				label: name.trim(),
				categories: [clubId],
				data: {
					dtb_id: dtbId,
					birth_date: birthDate,
					club_id: clubId,
					username: name.trim()
				}
			},
			feedback: "Spieler:in angelegt"
		});
		setOpen(false);
		setName("");
		setDtbId("");
		setBirthDate("");
		await refetchPeople();
	};

	return (
		<div className="flex col a-st gap-sm">
			<CreateButton
				text="Spieler:in erstellen"
				size="medium"
				onClick={() => setOpen(true)}
			/>
			<Table
				columns={columns}
				data={clubPlayers}
				rowIdResolver={(row) => (row as PersonClass).objectId}
			/>
			<SlideIn
				header="Spieler:in erstellen"
				isOpen={open}
				cancel={() => setOpen(false)}
				confirm={() => createPlayer()}
				confirmText="Anlegen"
				disabled={[false, errors.length > 0]}
				errors={errors}
			>
				<div className="flex col a-st gap-sm">
					<TextInput
						id="player-name"
						label="Name"
						defaultValue={name}
						onChange={setName}
					/>
					<TextInput
						id="player-dtb"
						label="DTB-ID"
						defaultValue={dtbId}
						onChange={setDtbId}
					/>
					<label htmlFor="player-birth">Geburtstag</label>
					<input
						id="player-birth"
						type="date"
						value={birthDate}
						onChange={(event) => setBirthDate(event.target.value)}
					/>
				</div>
			</SlideIn>
		</div>
	);
};

export default Players;
