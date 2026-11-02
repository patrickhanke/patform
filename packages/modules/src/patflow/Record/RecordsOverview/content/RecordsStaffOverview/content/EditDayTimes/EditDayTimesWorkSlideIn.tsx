"use client";

import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { WorkTimeEditorSession, WorkingTime } from "./types";
import { AbsenceTime, Day, ErrorMessage } from "@repo/types";
import {
	absence_type_options,
	axiosclient,
	getDefaultTime,
	getWorktimeDuration
} from "@repo/provider";
import { useDataHandler } from "@repo/provider";
import EditTime from "./content/EditDayTime";
import { cloneDeep, set } from "lodash-es";
import { Divider, Modal, SlideIn, StateDisplay } from "@repo/ui";
import { getDateString } from "@repo/provider";
import { formatISO9075 } from "date-fns";
import day_type_options from "./constants/day_type_options";
import useErrors from "./hooks/useErrors";

type EditDayTimesWorkSlideInProps = {
	session: WorkTimeEditorSession;
	onClose: () => void;
	userId: string;
};

const EditDayTimesWorkSlideIn: FC<EditDayTimesWorkSlideInProps> = ({
	session,
	onClose,
	userId
}) => {
	const { date, dayId, initialTime, times, refetch, records } = session;
	const [dayType, setDayType] = useState<(typeof day_type_options)[number]>(
		day_type_options[0]
	);
	const [time, setTime] = useState<WorkingTime | AbsenceTime>(
		initialTime ? initialTime : getDefaultTime(date).time
	);
	const [currentIndex, setCurrentIndex] = useState<number>(NaN);
	const { deleteData } = useDataHandler();
	const [disabled, setDisabled] = useState<[boolean, boolean]>([
		false,
		false
	]);
	const [errors, setErrors] = useState<ErrorMessage[]>([]);
	const [deleteModal, setDeleteModal] = useState(false);

	useErrors({
		date,
		dayType: dayType.value,
		time,
		times,
		setErrors,
		setDisabled,
		records
	});

	useEffect(() => {
		setDayType(day_type_options[0]);
		if (initialTime) {
			setTime(initialTime);
			const absenceType = absence_type_options.find(
				(option) => option.value === initialTime.type
			);
			if (absenceType) {
				setDayType({ ...day_type_options[1] });
			}
		} else {
			setTime(getDefaultTime(date).time);
		}
		setCurrentIndex(NaN);
		setDeleteModal(false);
		setDisabled([false, false]);
		setErrors([]);
	}, [session.key, initialTime, date]);

	const timeChangeHandler = useCallback((t: WorkingTime) => {
		const newTime: Day["time"] = cloneDeep(t);

		if (t?.start && t?.end) {
			set(newTime, "duration", getWorktimeDuration(t?.start, t?.end));
		}
		if (t?.breaks) {
			let pauseValue = 0;
			t.breaks.forEach((breakTime) => {
				pauseValue += getWorktimeDuration(
					breakTime.start,
					breakTime.end
				);
			});
			set(newTime, "pause", pauseValue);
		}

		setTime(newTime);
	}, []);

	const deleteDay = useCallback(
		async (objectId: string) => {
			await deleteData({
				className: "Day",
				objectId: objectId
			});
			await refetch();
			setDeleteModal(false);
			onClose();
		},
		[deleteData, onClose, refetch]
	);

	const confirmButtonHandler = useCallback(async () => {
		setDisabled([true, true]);

		if (time) {
			await axiosclient().post("/functions/create-time", {
				time: time,
				date: date,
				day_id: dayId,
				user_id: userId,
				type: dayType.value,
				comment: initialTime?.comment
			});
		}

		await refetch();
		onClose();
		setDisabled([false, false]);
	}, [
		date,
		dayId,
		dayType.value,
		initialTime?.comment,
		onClose,
		refetch,
		time,
		userId
	]);

	const secondaryContent = useMemo(() => {
		return (
			<div className="vertical_container gap-md">
				{dayType.value === "work" && (
					<EditTime
						key={currentIndex}
						time={time}
						date={date}
						timeChangeHandler={timeChangeHandler}
						errors={errors}
					/>
				)}
				{dayId && (
					<>
						<button
							className="full_button md red"
							onClick={() => setDeleteModal(true)}
						>
							löschen
						</button>
						<Modal
							header="Zeit löschen"
							isOpen={deleteModal}
							confirmButtonHandler={() => {
								if (dayId) {
									void deleteDay(dayId);
								}
							}}
							cancelButtonHandler={() => {
								setDeleteModal(false);
							}}
						>
							<p>
								Sind Sie sicher, dass Sie die Zeit löschen
								möchten?
							</p>
						</Modal>
					</>
				)}
			</div>
		);
	}, [
		currentIndex,
		date,
		dayId,
		dayType.value,
		deleteDay,
		deleteModal,
		errors,
		time,
		timeChangeHandler
	]);

	return (
		<SlideIn
			header={`Zeiten bearbeiten (${getDateString(formatISO9075(new Date(date))).date})`}
			confirm={() => confirmButtonHandler()}
			isOpen
			cancel={() => {
				setCurrentIndex(NaN);
				onClose();
			}}
			secondaryContent={secondaryContent}
			showSecondaryContent={true}
			disabled={disabled}
			errors={errors}
			preventClickOutside
		>
			<div className="flex col gap-md w-100">
				<h3>Übersicht</h3>
				<div className="horizontal_container">
					<div className="label">Typ</div>
					<p>
						{
							day_type_options.find(
								(option) => option.value === dayType.value
							)?.label
						}
					</p>
				</div>
				<Divider size="small" showLine />
				<div className="horizontal_container">
					<div className="label">Zeittyp</div>
					{dayType.value === "absence" ? (
						<StateDisplay
							label={
								absence_type_options?.find(
									(option) => option.value === time?.type
								)?.label || absence_type_options[0].label
							}
							color={
								absence_type_options?.find(
									(option) => option.value === time?.type
								)?.color || absence_type_options[0].color
							}
						/>
					) : (
						<StateDisplay label="Arbeitszeit" color={"green"} />
					)}
				</div>
				<Divider size="small" showLine={false} />
				<div className="horizontal_container">
					<div className="label">Startzeit</div>
					<p>{getDateString(initialTime?.start).time}</p>
				</div>
				<Divider size="small" showLine={false} />
				<div className="horizontal_container">
					<div className="label">Endzeit</div>
					<p>{getDateString(initialTime?.end).time}</p>
				</div>
			</div>
		</SlideIn>
	);
};

export default EditDayTimesWorkSlideIn;
