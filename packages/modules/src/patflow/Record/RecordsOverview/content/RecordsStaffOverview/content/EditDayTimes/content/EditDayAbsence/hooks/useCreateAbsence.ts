import { Dispatch, SetStateAction, useCallback } from "react";
import { Absence, Day, ErrorMessage, Record } from "@repo/types";
import { InitialAbsence } from "../../../../../../RecordsAbsence/content/EditRecordAbsence/types";
import { IntervalDay } from "../types";
import { DayDataTime } from "../../../../StaffWorkingTimes/types";
import {
	axiosclient,
	findDefaultTimeForDate,
	useDataHandler
} from "@repo/provider";
import { createTimeFromAbsence } from "../functions";

const useCreateAbsence = ({
	setLoading,
	setErrors,
	errors,
	type,
	absenceState,
	intervalDays,
	daysData,
	records,
	times,
	isFull,
	workerId,
	absenceId
}: {
	setLoading: Dispatch<SetStateAction<boolean>>;
	setErrors: Dispatch<SetStateAction<ErrorMessage[]>>;
	errors: ErrorMessage[];
	type: "edit" | "create";
	absenceState: InitialAbsence;
	intervalDays: IntervalDay[];
	daysData: Day[] | undefined;
	records: Record[];
	times: DayDataTime[] | undefined;
	isFull: boolean;
	workerId: string;
	absenceId?: string;
}) => {
	const { updateData, deleteData, createData } = useDataHandler();

	const editAbsenceHandler = useCallback(async () => {
		setLoading(true);

		if (!absenceId) {
			throw new Error("Absence ID is required");
		}

		await updateData({
			className: "Absence",
			objectId: absenceId,
			updateObject: {
				start_date: absenceState.start_date,
				end_date: absenceState.end_date,
				state: absenceState.state,
				comment: absenceState?.comment
			}
		});
		if (absenceState.objectId) {
			// Remove day handling error
			setErrors((prev) =>
				prev.filter((e) => e.id !== "day_handling_error")
			);

			try {
				const dayPromises = intervalDays
					.filter((day) => day.state)
					.map(async (intervalDay) => {
						// receive times for day
						const defaultTimeData = findDefaultTimeForDate(
							intervalDay.date,
							records
						);

						const timeData = isFull
							? defaultTimeData.default_time
							: createTimeFromAbsence(
									absenceState.start_date,
									absenceState.end_date,
									intervalDay.date,
									records,
									times,
									absenceState.objectId
								);

						if (intervalDay.state === "create" && timeData) {
							if (timeData) {
								return await axiosclient().post(
									"/functions/create-time",
									{
										time: timeData,
										type: "absence",
										date: intervalDay.date,
										user_id: workerId,
										day_id: undefined,
										absence_id: absenceId,
										comment: timeData?.comment
									}
								);
							}
							return null;
						} else if (
							intervalDay.state === "change" &&
							timeData &&
							intervalDay.objectId
						) {
							if (
								!isFull &&
								(timeData.start !== absenceState.start_date ||
									timeData.end !== absenceState.end_date)
							) {
								return await axiosclient().post(
									"/functions/update-time",
									{
										time: timeData,
										type: "absence",
										date: intervalDay.date,
										user_id: workerId,
										day_id: intervalDay.objectId,
										absence_id: absenceId,
										comment: timeData?.comment
									}
								);
							}
							if (timeData) {
								return await axiosclient().post(
									"/functions/create-time",
									{
										time: timeData,
										type: "absence",
										date: intervalDay.date,
										user_id: workerId,
										day_id: intervalDay.objectId,
										absence_id: absenceId,
										comment: timeData?.comment
									}
								);
							}
						} else if (
							intervalDay.state === "delete" &&
							intervalDay.objectId
						) {
							return await deleteData({
								className: "Day",
								objectId: intervalDay.objectId
							});
						}
					});

				await Promise.all(dayPromises);
			} catch (error) {
				setErrors([
					...errors,
					{
						id: "day_handling_error",
						key: "create_absence_error",
						message:
							error instanceof Error
								? error.message
								: "Fehler beim Verarbeiten der Tage"
					}
				]);
			}
		}
	}, [
		intervalDays,
		setLoading,
		setErrors,
		type,
		absenceState,
		isFull,
		daysData,
		records,
		times,
		errors
	]);

	const createAbsenceHandler = useCallback(async () => {
		setLoading(true);
		let absence: Absence;

		await createData({
			className: "Absence",
			updateObject: {
				start_date: absenceState.start_date,
				end_date: absenceState.end_date,
				state: absenceState.state,
				comment: absenceState?.comment,
				type: absenceState.type,
				year: absenceState.year,
				user: {
					__type: "Pointer",
					className: "_User",
					objectId: workerId
				}
			},
			afterSaveHandler: (data) => {
				absence = data;
			}
		});

		try {
			const dayPromises = intervalDays
				.filter((day) => day.state)
				.map(async (intervalDay) => {
					const defaultTimeData = findDefaultTimeForDate(
						intervalDay.date,
						records
					);

					const timeData = isFull
						? defaultTimeData.default_time
						: createTimeFromAbsence(
								absenceState.start_date,
								absenceState.end_date,
								intervalDay.date,
								records,
								times
							);
					if (timeData) {
						return await axiosclient().post(
							"/functions/create-time",
							{
								time: timeData,
								type: "absence",
								date: intervalDay.date,
								user_id: workerId,
								day_id: undefined,
								absence_id: absence.objectId,
								comment: timeData?.comment
							}
						);
					}
					return null;
				});

			await Promise.all(dayPromises);
		} catch (error) {
			setErrors([
				...errors,
				{
					id: "day_handling_error",
					key: "create_absence_error",
					message: "Fehler beim Erstellen der Anwesenheit: " + error
				}
			]);
		}
	}, [
		intervalDays,
		setLoading,
		setErrors,
		errors,
		absenceState,
		times,
		records,
		isFull
	]);

	return {
		editAbsenceHandler,
		createAbsenceHandler
	};
};

export default useCreateAbsence;
