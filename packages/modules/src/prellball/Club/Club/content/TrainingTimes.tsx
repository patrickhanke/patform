"use client";

import { FC, useEffect, useState } from "react";
import {
	CreateButton,
	IconButton,
	Modal,
	Select,
	SlideIn,
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
	locations: LocationClass[];
	divisions: DivisionCategory[];
	onClose: () => void;
	onSave: (time: PrellballTrainingTime) => void;
}> = ({ time, locations, divisions, onClose, onSave }) => {
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
			header={time ? "Trainingszeit bearbeiten" : "Neue Trainingszeit"}
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

const TrainingTimes: FC<{ locations: LocationClass[] }> = ({ locations }) => {
	const { project } = useAppContext();
	const divisions = useDivisionCategories(project?.objectId);
	const { data: club, setData } = usePageData<PrellballClubClass>();
	const [edit, setEdit] = useState<PrellballTrainingTime | null>(null);
	const [deleteId, setDeleteId] = useState("");
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
			{times.map((time) => {
				const location = locations.find(
					(item) => item.objectId === time.location_id
				);
				return (
					<div key={time.id} className="flex row a-ce j-sb gap-sm">
						<span>{time.title || "—"}</span>
						<span>{time.weekday}</span>
						<span>
							{timeValue(time.start_hours, time.start_minutes)} –{" "}
							{timeValue(time.end_hours, time.end_minutes)}
						</span>
						<span>{location?.title || "—"}</span>
						<span>
							{time.classes
								.map((id) => divisionLabel(id, divisions))
								.filter(Boolean)
								.join(", ") || "—"}
						</span>
						<div className="flex row a-ce gap-sm">
							<IconButton
								icon="edit"
								onClick={() => setEdit(time)}
							/>
							<IconButton
								icon="delete"
								onClick={() => setDeleteId(time.id)}
							/>
						</div>
					</div>
				);
			})}
			<CreateButton
				text="Neue Trainingszeit erstellen"
				size="medium"
				onClick={() => setEdit(emptyTime())}
			/>
			<TrainingEditor
				time={edit}
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
