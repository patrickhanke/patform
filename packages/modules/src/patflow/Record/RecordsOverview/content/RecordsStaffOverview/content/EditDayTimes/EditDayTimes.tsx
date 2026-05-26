"use client";

import { FC, useCallback, useState, useEffect, useMemo } from "react";
import { EditDayTimesProps, WorkingTime } from "./types";
import { AbsenceTime, Day, ErrorMessage } from "@repo/types";
import {
	absence_type_options,
	axiosclient,
	getDefaultTime,
	getWorktimeDuration
} from "@repo/provider";
import { useDataHandler } from "@repo/provider";
import EditTime from "./content/EditDayTime";
import { cloneDeep, isArray, set } from "lodash-es";
import { Divider, IconButton, Modal, SlideIn, StateDisplay } from "@repo/ui";
import { getDateString } from "@repo/provider";
import { formatISO9075 } from "date-fns";
import { EditDayAbsence } from "./content";
import day_type_options from "./constants/day_type_options";
import useErrors from "./hooks/useErrors";

const EditDayTimes: FC<EditDayTimesProps> = ({
	type,
	date,
	dayId,
	initialTime,
	times,
	days,
	refetch,
	userId,
	records,
	absenceId,
	color,
	label,
	isWorkingDay
}) => {
	const [slideIn, setSlideIn] = useState(false);
	const [editAbsence, setEditAbsence] = useState(false);
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
	}, [initialTime, date]);

	const timeChangeHandler = useCallback(
		(t: WorkingTime) => {
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
			// errorHandler("check", newTime);
		},
		[time]
	);

	const deleteDay = useCallback(async (objectId: string) => {
		await deleteData({
			className: "Day",
			objectId: objectId
		});
		await refetch();
		setDeleteModal(false);
	}, []);

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
		setSlideIn(false);
		setDisabled([false, false]);
	}, [time]);

	const secondaryContent = useMemo(() => {
		return (
			<div className="vertical_container gap-md">
				{dayType.value === "work" && (
					<>
						<EditTime
							key={currentIndex}
							time={time}
							date={date}
							timeChangeHandler={timeChangeHandler}
							errors={errors}
						/>
					</>
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
									deleteDay(dayId);
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
	}, [time, date, errors, records, dayType, deleteModal, dayId]);

	const timeType = useMemo(() => {
		const absenceType = absence_type_options.find(
			(option) => option.value === initialTime?.type
		);

		if (absenceType) {
			return absenceType;
		} else {
			return {
				value: initialTime?.type,
				label: ` A - ${getDateString(initialTime?.start).time} -
						${getDateString(initialTime?.end).time}`,
				color: "green"
			};
		}
	}, [initialTime, time]);

	const stateLabel = useMemo(() => {
		if (initialTime) {
			return `${getDateString(initialTime.start).time} -
						${getDateString(initialTime.end).time}`;
		}
		return null;
	}, [time]);

	const addButtonDisabled = useMemo(() => {
		let returnValue = false;
		if (isArray(times) && times.length > 0) {
			times.forEach((timeElement) => {
				// console.log({ timeElement });
				if (
					timeElement?.time?.type === "illness" &&
					timeElement?.time?.state === "full"
				) {
					returnValue = true;
				}
				if (timeElement?.time?.type === "vacation") {
					returnValue = true;
				}
				if (timeElement?.time?.type === "compensation_times") {
					returnValue = true;
				}
			});
		}
		return returnValue;
	}, [initialTime]);

	return (
		<>
			<div className="horizontal_container j-fe">
				{type === "edit" ? (
					<StateDisplay
						// icon="edit"
						onClick={() => {
							if (absenceId) {
								setEditAbsence(true);
							} else {
								setSlideIn(true);
							}
						}}
						label={label || stateLabel || ""}
						color={color || timeType.color}
					/>
				) : (
					<>
						<IconButton
							icon="plus"
							onClick={() => {
								setEditAbsence(true);
							}}
							text="Abwesenheit"
							color="dark"
							disabled={addButtonDisabled || !isWorkingDay}
						/>
						<IconButton
							icon="plus"
							onClick={() => {
								setDayType(day_type_options[0]);
								setSlideIn(true);
							}}
							text="Arbeitszeit"
							disabled={addButtonDisabled}
							color="dark"
						/>
					</>
				)}
			</div>
			<EditDayAbsence
				date={date}
				dayId={dayId}
				type={absenceId ? "edit" : "create"}
				times={times}
				days={days}
				absenceId={absenceId}
				records={records}
				workerId={userId}
				year={new Date().getFullYear()}
				isOpen={editAbsence}
				setIsOpen={setEditAbsence}
				refetch={refetch}
			/>
			<SlideIn
				header={`Zeiten bearbeiten (${getDateString(formatISO9075(new Date(date))).date})`}
				confirm={() => confirmButtonHandler()}
				isOpen={slideIn}
				cancel={() => {
					setCurrentIndex(NaN);
					// errorHandler("reset");
					setSlideIn(false);
				}}
				secondaryContent={secondaryContent}
				showSecondaryContent={true}
				disabled={disabled}
				errors={errors}
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
		</>
	);
};

export default EditDayTimes;
