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
import { CompetitionGame, CompetitionGameType } from "@repo/types";
import { CompetitionGameRow, CompetitionTabProps } from "../types";
import { CompetitionGameTypes } from "../constants/gameTypes";
import { createGame } from "../functions/factories";
import { getTeamLabel } from "../functions/getTeamLabel";
import { renumberGames } from "../functions/spielplanSort";
import { selectString } from "../functions/selectValue";

const Games: FC<CompetitionTabProps> = ({
	Competition,
	related,
	onUpdate,
	loading
}) => {
	const [draft, setDraft] = useState<CompetitionGame>(createGame());

	const groupOptions = Competition.groups.map((group) => ({
		value: group.id,
		label: group.name
	}));
	const matchdayOptions = Competition.matchdays.map((matchday) => ({
		value: matchday.id,
		label: `Spieltag ${matchday.spieltagNr}`
	}));

	const subgroupOptions = Competition.groups.flatMap((group) =>
		group.subgroups.map((subgroup) => ({
			value: subgroup.id,
			label: `${group.name} — ${subgroup.label}`
		}))
	);

	const selectedGroup = Competition.groups.find(
		(group) => group.id === draft.groupId
	);
	const selectedSubgroup = selectedGroup?.subgroups.find(
		(subgroup) => subgroup.id === draft.team1_group
	);
	const slotOptions =
		selectedSubgroup?.signupIds.map((_, index) => ({
			value: String(index + 1),
			label: `${index + 1}`
		})) || [];

	const rows: CompetitionGameRow[] = Competition.games.map((game) => ({
		...game,
		objectId: game.id
	}));

	const columns: ColumnDef<CompetitionGameRow>[] = useMemo(
		() => [
			{
				accessorFn: (row) => row.gameNr,
				header: () => <span>Nr.</span>,
				id: "gameNr",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) =>
					CompetitionGameTypes.find(
						(item) => item.value === row.type
					)?.label || row.type,
				header: () => <span>Typ</span>,
				id: "type",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => {
					const labels = getTeamLabel(
						row,
						Competition.games,
						Competition.groups,
						Competition.signups,
						related.clubs,
						Competition.show_class
					);
					return labels.team1.label;
				},
				header: () => <span>Team 1</span>,
				id: "team1",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => {
					const labels = getTeamLabel(
						row,
						Competition.games,
						Competition.groups,
						Competition.signups,
						related.clubs,
						Competition.show_class
					);
					return labels.team2.label;
				},
				header: () => <span>Team 2</span>,
				id: "team2",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) =>
					Competition.matchdays.find(
						(matchday) =>
							matchday.id === row.eventId ||
							matchday.eventId === row.eventId
					)?.spieltagNr || "—",
				header: () => <span>Spieltag</span>,
				id: "matchday",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => `${row.pass} / ${row.field}`,
				header: () => <span>DG / Feld</span>,
				id: "slot",
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
									games: renumberGames(
										Competition.games.filter(
											(item) => item.id !== row.id
										)
									)
								},
								"Spiel gelöscht"
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
			Competition.games,
			Competition.groups,
			Competition.matchdays,
			Competition.show_class,
			Competition.signups,
			loading,
			onUpdate,
			related.clubs
		]
	);

	const addGame = async () => {
		const next = createGame({
			...draft,
			gameNr: Competition.games.length + 1
		});
		await onUpdate(
			{ games: renumberGames([...Competition.games, next]) },
			"Spiel erstellt"
		);
		setDraft(
			createGame({ groupId: draft.groupId, eventId: draft.eventId })
		);
	};

	return (
		<div className="flex col a-st gap-sm">
			<div className="flex row a-ce gap-sm" style={{ flexWrap: "wrap" }}>
				<Select
					id="gameType"
					label="Typ"
					options={CompetitionGameTypes}
					value={
						CompetitionGameTypes.find(
							(item) => item.value === draft.type
						) || null
					}
					onChange={(option) =>
						setDraft((current) => ({
							...current,
							type:
								(selectString(
									option
								) as CompetitionGameType) || "grp"
						}))
					}
				/>
				<Select
					id="gameGroup"
					label="Gruppe"
					options={groupOptions}
					value={
						groupOptions.find(
							(option) => option.value === draft.groupId
						) || null
					}
					onChange={(option) =>
						setDraft((current) => ({
							...current,
							groupId: selectString(option) || undefined
						}))
					}
				/>
				<Select
					id="gameMatchday"
					label="Spieltag"
					options={matchdayOptions}
					value={
						matchdayOptions.find(
							(option) => option.value === draft.eventId
						) || null
					}
					onChange={(option) =>
						setDraft((current) => ({
							...current,
							eventId: selectString(option) || undefined
						}))
					}
				/>
				<Select
					id="team1Group"
					label="Untergruppe Team 1"
					options={subgroupOptions}
					value={
						subgroupOptions.find(
							(option) => option.value === draft.team1_group
						) || null
					}
					onChange={(option) =>
						setDraft((current) => ({
							...current,
							team1_group: selectString(option) || undefined,
							team2_group: selectString(option) || undefined
						}))
					}
				/>
				<Select
					id="team1Index"
					label="Slot 1"
					options={slotOptions}
					value={
						slotOptions.find(
							(option) =>
								option.value === String(draft.team1_index)
						) || null
					}
					onChange={(option) =>
						setDraft((current) => ({
							...current,
							team1_index:
								Number(selectString(option)) || undefined
						}))
					}
				/>
				<Select
					id="team2Index"
					label="Slot 2"
					options={slotOptions}
					value={
						slotOptions.find(
							(option) =>
								option.value === String(draft.team2_index)
						) || null
					}
					onChange={(option) =>
						setDraft((current) => ({
							...current,
							team2_index:
								Number(selectString(option)) || undefined
						}))
					}
				/>
				<TextInput
					id="pass"
					type="number"
					label="Durchgang"
					defaultValue={draft.pass}
					onChange={(value) =>
						setDraft((current) => ({
							...current,
							pass: Number(value) || 1
						}))
					}
				/>
				<TextInput
					id="field"
					type="number"
					label="Feld"
					defaultValue={draft.field}
					onChange={(value) =>
						setDraft((current) => ({
							...current,
							field: Number(value) || 1
						}))
					}
				/>
				<CreateButton
					text="Spiel anlegen"
					size="small"
					disabled={loading}
					onClick={addGame}
				/>
			</div>
			<Table columns={columns} data={rows} />
		</div>
	);
};

export default Games;
