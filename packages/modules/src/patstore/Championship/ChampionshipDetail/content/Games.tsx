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
import { ChampionshipGame, ChampionshipGameType } from "@repo/types";
import { ChampionshipGameRow, ChampionshipTabProps } from "../types";
import { championshipGameTypes } from "../constants/gameTypes";
import { createGame } from "../functions/factories";
import { getTeamLabel } from "../functions/getTeamLabel";
import { renumberGames } from "../functions/spielplanSort";
import { selectString } from "../functions/selectValue";

const Games: FC<ChampionshipTabProps> = ({
	championship,
	related,
	onUpdate,
	loading
}) => {
	const [draft, setDraft] = useState<ChampionshipGame>(createGame());

	const groupOptions = championship.groups.map((group) => ({
		value: group.id,
		label: group.name
	}));
	const matchdayOptions = championship.matchdays.map((matchday) => ({
		value: matchday.id,
		label: `Spieltag ${matchday.spieltagNr}`
	}));

	const subgroupOptions = championship.groups.flatMap((group) =>
		group.subgroups.map((subgroup) => ({
			value: subgroup.id,
			label: `${group.name} — ${subgroup.label}`
		}))
	);

	const selectedGroup = championship.groups.find(
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

	const rows: ChampionshipGameRow[] = championship.games.map((game) => ({
		...game,
		objectId: game.id
	}));

	const columns: ColumnDef<ChampionshipGameRow>[] = useMemo(
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
					championshipGameTypes.find(
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
						championship.games,
						championship.groups,
						championship.signups,
						related.entries,
						championship.show_class
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
						championship.games,
						championship.groups,
						championship.signups,
						related.entries,
						championship.show_class
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
					championship.matchdays.find(
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
										championship.games.filter(
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
			championship.games,
			championship.groups,
			championship.matchdays,
			championship.show_class,
			championship.signups,
			loading,
			onUpdate,
			related.entries
		]
	);

	const addGame = async () => {
		const next = createGame({
			...draft,
			gameNr: championship.games.length + 1
		});
		await onUpdate(
			{ games: renumberGames([...championship.games, next]) },
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
					options={championshipGameTypes}
					value={
						championshipGameTypes.find(
							(item) => item.value === draft.type
						) || null
					}
					onChange={(option) =>
						setDraft((current) => ({
							...current,
							type:
								(selectString(
									option
								) as ChampionshipGameType) || "grp"
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
