import { FC, useCallback, useState, useEffect, useMemo } from "react";
import { EditDayTimesProps, WorkingTime } from "./types";
import { AbsenceTime, Day, ErrorMessage } from "@repo/types";
import {
	absence_type_options,
	axiosclient,
	convertDateToString,
	findDefaultTimeForDate,
	getDefaultTime,
	getWorktimeDuration
} from "@repo/provider";
import { useDataHandler } from "@repo/provider";
import EditTime from "./content/EditDayTime";
import { cloneDeep, isArray, set } from "lodash-es";
import {
	Divider,
	IconButton,
	Modal,
	SlideIn,
	StateDisplay,
	SwitchButtons
} from "@repo/ui";
import { getDateString } from "@repo/provider";
import { formatISO9075 } from "date-fns";
import EditDayAbsence from "./content/EditDayAbsence";
import day_type_options from "./constants/day_type_options";
import useErrors from "./hooks/useErrors";
import { v4 as generateUuid } from "uuid";
import { DayDataTime } from "../StaffWorkingTimes";

const EditDayTimes: FC<EditDayTimesProps> = ({
	type,
	date,
	dayId,
	initialTime,
	times,
	refetch,
	userId,
	records
}) => {
	const [slideIn, setSlideIn] = useState(false);
	const [dayType, setDayType] = useState<(typeof day_type_options)[number]>(
		day_type_options[0]
	);
	const [time, setTime] = useState<WorkingTime | AbsenceTime | DayDataTime>(
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

	const absenceChangeHandler = useCallback(
		(timeValue: AbsenceTime) => {
			const timeCopy = cloneDeep(timeValue);
			if (timeValue?.start && timeValue?.end) {
				const defaultTime = findDefaultTimeForDate(date, records);

				let totalDuration = 0;
				if (defaultTime?.default_time?.duration) {
					totalDuration =
						defaultTime?.default_time?.duration -
						defaultTime?.default_time?.pause;
				}

				let currentDuration = 0;

				if (isArray(times) && time?.day_id) {
					const currentTimes = times.filter(
						(t) => t.day_id !== time.day_id
					);

					currentTimes.forEach((time) => {
						currentDuration += time.duration - time.pause;
					});
				}

				const absenceDuration = getWorktimeDuration(
					timeValue?.start,
					timeValue?.end
				);

				currentDuration += absenceDuration;

				const breakArray = [];
				let pauseTime = 0;
				if (currentDuration > totalDuration) {
					const pauseDuration = currentDuration - totalDuration;

					const pauseStart =
						new Date(time.end).getTime() - pauseDuration;
					const pauseId = generateUuid();

					breakArray.push({
						start: convertDateToString(
							new Date(pauseStart).toISOString()
						),
						end: time.end,
						id: pauseId
					});

					pauseTime = getWorktimeDuration(
						convertDateToString(new Date(pauseStart)),
						time.end
					);
				}

				set(
					timeCopy,
					"duration",
					getWorktimeDuration(timeValue?.start, timeValue?.end)
				);
				set(timeCopy, "breaks", breakArray);
				set(timeCopy, "pause", pauseTime);
			}

			setTime(timeCopy);
		},
		[time, times, records]
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
				type: dayType.value
			});
		}

		await refetch();
		setSlideIn(false);
		setDisabled([false, false]);
	}, [time]);

	const dayTypeHandler = useCallback(
		(newDayType: (typeof day_type_options)[number]) => {
			if (newDayType.value === "work") {
				if (initialTime) {
					setTime(initialTime);
				} else {
					setTime(getDefaultTime(date).time);
				}
			} else if (newDayType.value === "absence") {
				const defaultTime = getDefaultTime(date).time;
				setTime({
					...defaultTime,
					type: "vacation",
					state: "full"
				} as AbsenceTime);
			}
			setDayType(newDayType);
		},
		[setDayType]
	);

	const secondaryContent = useMemo(() => {
		return (
			<div className="vertical_container gap-md">
				<SwitchButtons
					buttonStates={
						type === "edit"
							? [...day_type_options].map((option) => ({
									...option,
									disabled: true
								}))
							: [...day_type_options]
					}
					currentStates={dayType}
					changeHandler={dayTypeHandler}
					underlineButtons
					showBottomLine
				/>
				<Divider size="small" showLine={false} />
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
				{dayType.value === "absence" && (
					<EditDayAbsence
						date={date}
						time={time}
						setTime={(timeValue) => {
							absenceChangeHandler(timeValue);
						}}
						records={records}
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
				value: time.type,
				label: ` A - ${getDateString(time.start).time} -
						${getDateString(time.end).time}`,
				color: "green"
			};
		}
	}, [initialTime, time]);

	const stateLabel = useMemo(() => {
		if (initialTime) {
			return `${getDateString(initialTime.start).time} -
						${getDateString(initialTime.end).time}`;
		}
		return `${getDateString(time.start).time} -
						${getDateString(time.end).time}`;
	}, [time]);

	const addButtonDisabled = useMemo(() => {
		let returnValue = false;
		if (isArray(times) && times.length > 0) {
			times.forEach((timeElement) => {
				if (
					timeElement?.type === "illness" &&
					timeElement?.state === "full"
				) {
					returnValue = true;
				}
				if (timeElement?.type === "vacation") {
					returnValue = true;
				}
			});
		}
		return returnValue;
	}, [times]);

	return (
		<>
			<div className="horizontal_container j-fe">
				{type === "edit" ? (
					<StateDisplay
						// icon="edit"
						onClick={() => setSlideIn(true)}
						label={stateLabel}
						color={timeType.color}
					/>
				) : (
					<IconButton
						icon="plus"
						onClick={() => setSlideIn(true)}
						text="Zeit hinzufügen"
						disabled={addButtonDisabled}
						color="dark"
					/>
				)}
			</div>
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
					<div className="horizontal_container">
						<div className="label">Startzeit</div>
						<p>{getDateString(time?.start).time}</p>
					</div>
					<div className="horizontal_container">
						<div className="label">Endzeit</div>
						<p>{getDateString(time?.end).time}</p>
					</div>
				</div>
			</SlideIn>
		</>
	);
};

export default EditDayTimes;
