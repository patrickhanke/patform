import { FC, useCallback, useState } from "react";
import { EditDayTimesProps, WorkingTime } from "./types";
import { Day, ErrorMessage } from "@repo/types";
import {
	axiosclient,
	getDefaultTime,
	getWorktimeDuration
} from "@repo/provider";
import { useDataHandler } from "@repo/provider";
import EditTime from "./components/EditTime";
import { cloneDeep, set } from "lodash-es";
import { IconButton, Modal, SlideIn } from "@repo/ui";
import { getDateString } from "@repo/provider";

const EditDayTimes: FC<EditDayTimesProps> = ({
	type,
	date,
	dayId,
	initialTime,
	refetch,
	userId
}) => {
	console.log({ dayId, userId });

	const [slideIn, setSlideIn] = useState(false);
	const [time, setTime] = useState<WorkingTime>(
		initialTime || getDefaultTime(date).time
	);
	const [currentIndex, setCurrentIndex] = useState<number>(NaN);
	const { deleteData, updateData } = useDataHandler();
	const [disabled, setDisabled] = useState<[boolean, boolean]>([
		false,
		false
	]);
	const [errors, setErrors] = useState<ErrorMessage[]>([]);
	const [deleteModal, setDeleteModal] = useState(false);

	console.log({ time });

	const errorHandler = useCallback(
		(type: "check" | "reset", wt?: Day["time"]) => {
			if (type === "check" && wt) {
				const disabledArray: [boolean, boolean] = [false, false];
				const errorArray: ErrorMessage[] = [];
				if (!wt.start || !wt.end) {
					disabledArray[1] = true;
					errorArray.push({
						id: "time",
						key: `time`,
						message: "Bitte Start- und Endzeit angeben"
					});
				}
				setDisabled(disabledArray);
				setErrors(errorArray);
			}
			if (type === "reset") {
				setDisabled([false, false]);
				setErrors([]);
			}
		},
		[time]
	);

	const timeChangeHandler = useCallback(
		(t: WorkingTime) => {
			const newTime: Day["time"] = cloneDeep(t);
			console.log("newTime", newTime);

			if (t?.start && t?.end) {
				set(newTime, "duration", getWorktimeDuration(t?.start, t?.end));
			}

			setTime(newTime);
			errorHandler("check", newTime);
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

		if (dayId && time) {
			await updateData({
				className: "Day",
				objectId: dayId,
				updateObject: {
					time: time
				}
			});
		} else {
			await axiosclient().post("/functions/create-time", {
				time: time,
				date: date,
				day_id: dayId,
				user_id: userId
			});
		}

		await refetch();
		setSlideIn(false);
		setDisabled([false, false]);
	}, [time]);

	return (
		<>
			<div>
				{type === "edit" ? (
					<span
						style={{
							textDecoration: "underline",
							cursor: "pointer"
						}}
						onClick={() => setSlideIn(true)}
					>
						{getDateString(time.start).time} -{" "}
						{getDateString(time.end).time}{" "}
					</span>
				) : (
					<IconButton
						icon="plus"
						onClick={() => setSlideIn(true)}
						text="Neue Arbeiteszeit erstellen"
					/>
				)}
			</div>
			<SlideIn
				header="Zeiten bearbeiten"
				confirm={() => confirmButtonHandler()}
				isOpen={slideIn}
				cancel={() => {
					setCurrentIndex(NaN);
					errorHandler("reset");
					setSlideIn(false);
				}}
				showSecondaryContent={!isNaN(currentIndex)}
				disabled={disabled}
				errors={errors}
			>
				<EditTime
					key={currentIndex}
					time={time}
					date={date}
					timeChangeHandler={timeChangeHandler}
				/>
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
			</SlideIn>
		</>
	);
};

export default EditDayTimes;
