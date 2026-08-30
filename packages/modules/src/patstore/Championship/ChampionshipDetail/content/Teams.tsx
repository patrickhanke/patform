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
import { ChampionshipSignupRow, ChampionshipTabProps } from "../types";
import { createSignup } from "../functions/factories";
import { signupLabel } from "../functions/getTeamLabel";
import { selectString } from "../functions/selectValue";

const Teams: FC<ChampionshipTabProps> = ({
	championship,
	related,
	onUpdate,
	loading
}) => {
	const [entryId, setEntryId] = useState("");
	const [teamClass, setTeamClass] = useState(championship.classes[0] || "");

	const clubOptions = related.clubs.map((club) => ({
		value: club.objectId,
		label: club.title
	}));
	const classOptions = championship.classes.map((item) => ({
		value: item,
		label: item
	}));

	const rows: ChampionshipSignupRow[] = championship.signups.map(
		(signup) => ({
			...signup,
			objectId: signup.id
		})
	);

	const columns: ColumnDef<ChampionshipSignupRow>[] = useMemo(
		() => [
			{
				accessorFn: (row) =>
					signupLabel(row, related.clubs, championship.show_class),
				header: () => <span>Mannschaft</span>,
				id: "team",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => row.class || "—",
				header: () => <span>Klasse</span>,
				id: "class",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => row.number,
				header: () => <span>Nr.</span>,
				id: "number",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => row.personIds.length,
				header: () => <span>Spieler</span>,
				id: "players",
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
									signups: championship.signups.filter(
										(item) => item.id !== row.id
									)
								},
								"Meldung entfernt"
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
			championship.show_class,
			championship.signups,
			loading,
			onUpdate,
			related.clubs
		]
	);

	const addSignup = async () => {
		if (!entryId) {
			return;
		}
		const sameClub = championship.signups.filter(
			(signup) => signup.entryId === entryId && signup.class === teamClass
		);
		const signup = createSignup({
			entryId,
			class: teamClass || undefined,
			number: sameClub.length + 1
		});
		await onUpdate(
			{ signups: [...championship.signups, signup] },
			"Mannschaft gemeldet"
		);
		setEntryId("");
	};

	return (
		<div className="flex col a-st gap-sm">
			<p>Meldungen sind Vereine aus dem Vereine-Modul.</p>
			<div className="flex row a-ce gap-sm" style={{ flexWrap: "wrap" }}>
				<Select
					id="entryId"
					label="Verein"
					options={clubOptions}
					value={
						clubOptions.find(
							(option) => option.value === entryId
						) || null
					}
					onChange={(option) => setEntryId(selectString(option))}
				/>
				{classOptions.length > 0 ? (
					<Select
						id="teamClass"
						label="Spielklasse"
						options={classOptions}
						value={
							classOptions.find(
								(option) => option.value === teamClass
							) || null
						}
						onChange={(option) =>
							setTeamClass(selectString(option))
						}
					/>
				) : (
					<TextInput
						id="teamClass"
						label="Spielklasse"
						defaultValue={teamClass}
						onChange={setTeamClass}
					/>
				)}
				<CreateButton
					text="Mannschaft hinzufügen"
					size="small"
					disabled={loading || !entryId}
					onClick={addSignup}
				/>
			</div>
			<Table columns={columns} data={rows} />
		</div>
	);
};

export default Teams;
