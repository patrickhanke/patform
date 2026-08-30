"use client";

import { FC, useMemo, useState } from "react";
import {
	ClubClass,
	ClubTrainingTime
} from "@repo/types";
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
import { ClubTabProps } from "../types";
import { createTrainingTime } from "../functions/factories";
import { formatTime, timeSelectValue } from "../functions/formatTime";
import { dayTimes, weekdays } from "../constants/trainingTimes";
import { selectString } from "../../../Championship/ChampionshipDetail/functions/selectValue";

const TrainingTimes: FC<ClubTabProps> = ({ related }) => {
	const { data: club, setData } = usePageData<ClubClass>();
	const [editIndex, setEditIndex] = useState<number | null>(null);
	const [draft, setDraft] = useState<ClubTrainingTime>(createTrainingTime());

	const locationOptions = related.locations.map((location) => ({
		value: location.objectId,
		label: location.address
			? `${location.title} ${location.address}`
			: location.title
	}));
	const groupOptions = related.groups.map((group) => ({
		value: group.objectId,
		label: group.title
	}));

	const training = club?.training || [];

	const openEdit = (index: number) => {
		const item = training[index];
		if (!item) {
			return;
		}
		setDraft({ ...item });
		setEditIndex(index);
	};

	const saveDraft = () => {
		if (editIndex == null || !club) {
			return;
		}
		const next = [...training];
		next[editIndex] = draft;
		setData("training", next);
		setEditIndex(null);
	};

	const columns: ColumnDef<ClubTrainingTime>[] = useMemo(
		() => [
			{
				accessorFn: (row) => row.title || "—",
				header: () => <span>Titel</span>,
				id: "title",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => row.weekday || "—",
				header: () => <span>Tag</span>,
				id: "weekday",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) =>
					`${formatTime(row.startHours, row.startMinutes)} - ${formatTime(row.endHours, row.endMinutes)}`,
				header: () => <span>Uhrzeit</span>,
				id: "time",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) =>
					related.locations.find(
						(location) => location.objectId === row.gymId
					)?.title || "—",
				header: () => <span>Halle</span>,
				id: "gym",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) =>
					row.groupIds
						.map(
							(id) =>
								related.groups.find(
									(group) => group.objectId === id
								)?.title
						)
						.filter(Boolean)
						.join(", ") || "—",
				header: () => <span>Trainingsgruppen</span>,
				id: "groups",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => (
					<div className="button_container">
						<IconButton
							icon="edit"
							onClick={() => {
								const index = training.findIndex(
									(item) => item.id === row.id
								);
								if (index >= 0) {
									openEdit(index);
								}
							}}
						/>
						<IconButton
							icon="delete"
							color="secondary"
							onClick={() =>
								setData(
									"training",
									training.filter((item) => item.id !== row.id)
								)
							}
						/>
					</div>
				),
				header: () => <span>Bearbeiten</span>,
				id: "actions",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			}
		],
		[related.groups, related.locations, training]
	);

	if (!club) {
		return null;
	}

	return (
		<div className="flex col a-st gap-sm">
			<Table
				columns={columns}
				data={training}
				rowIdResolver={(row) => (row as ClubTrainingTime).id}
			/>
			<CreateButton
				text="Neue Trainingszeit erstellen"
				size="small"
				onClick={() => {
					const next = createTrainingTime();
					setData("training", [...training, next]);
					setDraft(next);
					setEditIndex(training.length);
				}}
			/>
			<SlideIn
				header="Trainingszeit bearbeiten"
				isOpen={editIndex != null}
				cancel={() => setEditIndex(null)}
				confirm={saveDraft}
				confirmText="Übernehmen"
			>
				<div className="flex col a-st gap-sm">
					<TextInput
						id="training-title"
						label="Titel der Trainingsgruppe"
						defaultValue={draft.title}
						onChange={(value) =>
							setDraft((current) => ({ ...current, title: value }))
						}
					/>
					<Select
						id="training-weekday"
						label="Wochentag"
						options={weekdays}
						value={
							weekdays.find(
								(day) => day.value === draft.weekday
							) || null
						}
						onChange={(option) =>
							setDraft((current) => ({
								...current,
								weekday: selectString(option)
							}))
						}
					/>
					<div className="flex row a-ce gap-sm">
						<Select
							id="training-start"
							label="Startzeit"
							options={dayTimes}
							value={timeSelectValue(
								draft.startHours,
								draft.startMinutes
							)}
							onChange={(option) => {
								const [hours, minutes] = selectString(option)
									.split(":")
									.map(Number);
								setDraft((current) => ({
									...current,
									startHours: Number.isFinite(hours)
										? hours
										: null,
									startMinutes: Number.isFinite(minutes)
										? minutes
										: null
								}));
							}}
						/>
						<Select
							id="training-end"
							label="Endzeit"
							options={dayTimes}
							value={timeSelectValue(
								draft.endHours,
								draft.endMinutes
							)}
							onChange={(option) => {
								const [hours, minutes] = selectString(option)
									.split(":")
									.map(Number);
								setDraft((current) => ({
									...current,
									endHours: Number.isFinite(hours)
										? hours
										: null,
									endMinutes: Number.isFinite(minutes)
										? minutes
										: null
								}));
							}}
					</div>
					<Select
						id="training-gym"
						label="Halle"
						isClearable
						options={locationOptions}
						value={
							locationOptions.find(
								(option) => option.value === draft.gymId
							) || null
						}
						onChange={(option) =>
							setDraft((current) => ({
								...current,
								gymId: selectString(option) || undefined
							}))
						}
					/>
					<Select
						id="training-groups"
						label="Spielklassen"
						isMulti
						options={groupOptions}
						value={groupOptions.filter((option) =>
							draft.groupIds.includes(String(option.value))
						)}
						onChange={(options) => {
							const groupIds = (
								Array.isArray(options)
									? options
									: options
										? [options]
										: []
							).map((option) => String(option.value));
							setDraft((current) => ({
								...current,
								groupIds
							}));
						}}
					/>
				</div>
			</SlideIn>
		</div>
	);
};

export default TrainingTimes;
