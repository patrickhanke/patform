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

	console.log({ isFull });

	const editAbsenceHandler = useCallback(async () => {
		console.log({ intervalDays });
		setLoading(true);
		if (type === "edit") {
			if (absenceState.objectId) {
				// Remove day handling error
				setErrors((prev) =>
					prev.filter((e) => e.id !== "day_handling_error")
				);

				try {
					const dayPromises = intervalDays
						.filter((day) => day.state)
						.map(async (intervalDay) => {
							const existingDay = daysData?.find(
								(d) => d.date === intervalDay.date
							);
							// receive times for day
							console.log({ existingDay });
							const defaultTimeData = findDefaultTimeForDate(
								intervalDay.date,
								records
							);

							console.log({ defaultTimeData });

							const is_working_day =
								defaultTimeData?.is_working_day || false;

							const timeData = isFull
								? defaultTimeData.time
								: createTimeFromAbsence(
										absenceState.start_date,
										absenceState.end_date,
										intervalDay.date,
										records,
										times,
										absenceState.objectId
									);

							console.log({ timeData });
						});

					await Promise.all(dayPromises);
				} catch (error) {
					console.error("Error creating absence:", error);
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
		console.log({ intervalDays });
		setLoading(true);
		let absence: Absence;

		await createData({
			className: "Absence",
			updateObject: {
				start_date: absenceState.start_date,
				end_date: absenceState.end_date,
				state: absenceState.state,
				comment: absenceState.comment,
				type: absenceState.type,
				year: absenceState.year,
				user: {
					__type: "Pointer",
					className: "_User",
					objectId: workerId
				}
			},
			afterSaveHandler: (data) => {
				console.log({ data });
				absence = data;
			}
		});

		try {
			const dayPromises = intervalDays
				.filter((day) => day.state)
				.map(async (intervalDay) => {
					console.log({ intervalDay });
					const defaultTimeData = findDefaultTimeForDate(
						intervalDay.date,
						records
					);

					console.log({ defaultTimeData });

					const is_working_day =
						defaultTimeData?.is_working_day || false;

					console.log({ is_working_day });
					console.log({ isFull });
					const timeData = isFull
						? defaultTimeData.default_time
						: createTimeFromAbsence(
								absenceState.start_date,
								absenceState.end_date,
								intervalDay.date,
								records,
								times
							);
					console.log({ timeData });
					return await axiosclient().post("/functions/create-time", {
						time: timeData,
						type: "absence",
						date: intervalDay.date,
						user_id: workerId,
						day_id: undefined,
						absence_id: absence.objectId,
						comment: timeData.comment
					});
				});

			await Promise.all(dayPromises);
		} catch (error) {
			console.error("Error creating absence:", error);
			setErrors([
				...errors,
				{
					id: "day_handling_error",
					key: "create_absence_error",
					message: "Fehler beim Erstellen der Anwesenheit"
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
