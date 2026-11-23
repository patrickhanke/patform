"use client";

import { FC, useEffect, useMemo, useState } from "react";
import {
	ColumnDef,
	IconButton,
	Modal,
	Select,
	SlideIn,
	Table,
	TextInput,
	usePageData
} from "@repo/ui";
import {
	PrellballTrainingTime,
	LocationClass,
	PrellballClubClass
} from "@repo/types";
import { useAppContext } from "@repo/provider";
import { createId } from "../../../Championship/functions/ids";
import {
	selectString,
	selectStrings
} from "../../../Championship/functions/selectValue";
import { DivisionCategory, divisionLabel } from "../../../functions/divisions";
import useDivisionCategories from "../../../hooks/useDivisionCategories";
import { dayTimes, weekdays } from "../../constants/times";

const emptyTime = (): PrellballTrainingTime => ({
	id: createId(),
	title: "",
	weekday: "Montag",
	start_hours: 18,
	start_minutes: 0,
	end_hours: 19,
	end_minutes: 30,
	contact: true,
	classes: [],
	location_id: ""
});

const timeValue = (hours: number | null, minutes: number | null) => {
	if (hours == null || minutes == null) return "";
	return `${hours}:${String(minutes).padStart(2, "0")}`;
};

const TrainingEditor: FC<{
	time: PrellballTrainingTime | null;
	existingIds?: Set<string>;
	locations: LocationClass[];
	divisions: DivisionCategory[];
	onClose: () => void;
	onSave: (time: PrellballTrainingTime) => void;
}> = ({ time, existingIds, locations, divisions, onClose, onSave }) => {
	const [draft, setDraft] = useState<PrellballTrainingTime>(
		time || emptyTime()
	);
	useEffect(() => {
		if (time) setDraft(time);
	}, [time]);
	const classOptions = divisions.map((item) => ({
		value: item.objectId,
		label: item.title || item.label || item.objectId
	}));
	const locationOptions = locations.map((location) => ({
		value: location.objectId,
		label: location.address
			? `${location.title} - ${location.address}`
			: location.title
	}));

	return (
		<SlideIn
			header={
				time && existingIds?.has(time.id)
					? "Trainingszeit bearbeiten"
					: "Neue Trainingszeit"
			}
			isOpen={Boolean(time)}
			cancel={onClose}
			confirm={() => onSave(draft)}
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
							(option) => option.value === draft.weekday
						) || null
					}
					onChange={(option) =>
						setDraft((current) => ({
							...current,
							weekday: selectString(option)
						}))
					}
				/>
				<Select
					id="training-start"
					label="Startzeit"
					options={dayTimes}
					value={
						dayTimes.find(
							(option) =>
								option.value ===
								timeValue(
									draft.start_hours,
									draft.start_minutes
								)
						) || null
					}
					onChange={(option) => {
						const match = dayTimes.find(
							(item) => item.value === selectString(option)
						);
						setDraft((current) => ({
							...current,
							start_hours: match?.hours ?? null,
							start_minutes: match?.minutes ?? null
						}));
					}}
				/>
				<Select
					id="training-end"
					label="Endzeit"
					options={dayTimes}
					value={
						dayTimes.find(
							(option) =>
								option.value ===
								timeValue(draft.end_hours, draft.end_minutes)
						) || null
					}
					onChange={(option) => {
						const match = dayTimes.find(
							(item) => item.value === selectString(option)
						);
						setDraft((current) => ({
							...current,
							end_hours: match?.hours ?? null,
							end_minutes: match?.minutes ?? null
						}));
					}}
				/>
				<Select
					id="training-location"
					label="Halle"
					isClearable
					options={locationOptions}
					value={
						locationOptions.find(
							(option) => option.value === draft.location_id
						) || null
					}
					onChange={(option) =>
						setDraft((current) => ({
							...current,
							location_id: selectString(option)
						}))
					}
				/>
				<Select
					id="training-classes"
					label="Spielklassen"
					isMulti
					options={classOptions}
					value={classOptions.filter((option) =>
						draft.classes.includes(option.value)
					)}
					onChange={(option) =>
						setDraft((current) => ({
							...current,
							classes: selectStrings(option)
						}))
					}
				/>
			</div>
		</SlideIn>
	);
};

const TrainingTimes: FC<{
	locations: LocationClass[];
	createOpen: boolean;
	onCreateClose: () => void;
}> = ({ locations, createOpen, onCreateClose }) => {
	const { project } = useAppContext<"patstore">();
	const divisions = useDivisionCategories(project?.objectId);
	const { data: club, setData } = usePageData<PrellballClubClass>();
	const [edit, setEdit] = useState<PrellballTrainingTime | null>(null);
	const [deleteId, setDeleteId] = useState("");

	useEffect(() => {
		if (!createOpen) return;
		setEdit(emptyTime());
		onCreateClose();
	}, [createOpen, onCreateClose]);

	const columns: ColumnDef<PrellballTrainingTime>[] = useMemo(
		() => [
			{
				id: "title",
				header: () => <span>Titel</span>,
				accessorFn: (row) => row.title || "—",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false
			},
			{
				id: "weekday",
				header: () => <span>Wochentag</span>,
				accessorFn: (row) => row.weekday || "—",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false
			},
			{
				id: "time",
				header: () => <span>Zeit</span>,
				accessorFn: (row) =>
					`${timeValue(row.start_hours, row.start_minutes)} – ${timeValue(
						row.end_hours,
						row.end_minutes
					)}`,
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false
			},
			{
				id: "location",
				header: () => <span>Halle</span>,
				accessorFn: (row) =>
					locations.find((item) => item.objectId === row.location_id)
						?.title || "—",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false
			},
			{
				id: "classes",
				header: () => <span>Spielklassen</span>,
				accessorFn: (row) =>
					row.classes
						.map((id) => divisionLabel(id, divisions))
						.filter(Boolean)
						.join(", ") || "—",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false
			},
			{
				id: "edit",
				header: () => <span>Bearbeiten</span>,
				accessorFn: (row) => row.id,
				cell: (info) => (
					<div className="button_container">
						<IconButton
							icon="edit"
							onClick={() => setEdit(info.row.original)}
						/>
						<IconButton
							icon="delete"
							onClick={() => setDeleteId(info.row.original.id)}
						/>
					</div>
				),
				footer: (info) => info.column.id,
				enableSorting: false
			}
		],
		[divisions, locations]
	);

	if (!club) return null;
	const times = club.data.training_times || [];

	const save = (time: PrellballTrainingTime) => {
		const exists = times.some((item) => item.id === time.id);
		setData(
			"data.training_times",
			exists
				? times.map((item) => (item.id === time.id ? time : item))
				: [...times, time]
		);
		setEdit(null);
	};

	return (
		<div className="flex col a-st gap-sm">
			<Table
				columns={columns}
				data={times}
				rowIdResolver={(row) => (row as PrellballTrainingTime).id}
			/>
			<TrainingEditor
				time={edit}
				existingIds={new Set(times.map((item) => item.id))}
				locations={locations}
				divisions={divisions}
				onClose={() => setEdit(null)}
				onSave={save}
			/>
			<Modal
				isOpen={Boolean(deleteId)}
				header="Trainingszeit löschen"
				cancelButtonHandler={() => setDeleteId("")}
				confirmButtonHandler={() => {
					setData(
						"data.training_times",
						times.filter((item) => item.id !== deleteId)
					);
					setDeleteId("");
				}}
				confirmButtonText="Löschen"
			>
				<p>Diese Trainingszeit wird entfernt.</p>
			</Modal>
		</div>
	);
};

export default TrainingTimes;
