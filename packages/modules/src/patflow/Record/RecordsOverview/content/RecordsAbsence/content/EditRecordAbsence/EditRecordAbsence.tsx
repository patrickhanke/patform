import {
	absence_state_options,
	createIntervalFromTimes,
	findDefaultTimeForDate,
	getSaldo,
	getDefaultTime,
	getDateString,
	absence_type_options,
	PatflowAppContext,
	useGetActiveRecord,
	UserContext
} from "@repo/provider";
import { useDataHandler, generateGraphQLQuery } from "@repo/provider";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DatePicker, DisplayWorker, Select } from "@repo/ui";
import { EditRecordAbsenceComponent } from "./types";
import { Day, ErrorMessage, StaffMember } from "@repo/types";
import { FIND_ALL_STAFF, find_day } from "@repo/provider";
import { useQuery } from "@apollo/client";
import checkForConflicts from "./functions/checkForConflicts";
import { cloneDeep } from "lodash-es";
import initialAbsence from "./constants/initialAbsence";
import checkForAbsenceConflicts from "./functions/checkForAbsenceConflicts";
import { SlideIn, TextInput } from "@repo/ui";

const EditRecordAbsence = ({
	refetch,
	type,
	absence,
	editAbsence,
	setEditAbsence
}: EditRecordAbsenceComponent) => {
	const [errors, setErrors] = useState<ErrorMessage[]>([]);
	const [absenceState, setAbsenceState] = useState(
		type === "edit" ? absence : initialAbsence
	);
	const { data: staffData } = useQuery(FIND_ALL_STAFF);
	const { user } = useContext(UserContext);
	const { year } = useContext(PatflowAppContext);
	const { record } = useGetActiveRecord({
		year,
		userId: absenceState?.user?.objectId as string
	});

	const { updateData, createData, deleteData, loading } = useDataHandler();
	const { data: dayData } = useQuery(find_day, {
		variables: { params: { user: { _eq: absenceState?.user?.objectId } } },
		skip: !absenceState?.user
	});

	const { data: absenceDayData } = useQuery(find_day, {
		variables: { params: { absence: { _eq: absence?.objectId } } },
		skip: !absence
	});

	const { data: userAbsenceData } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Absence",
			fields: [
				"objectId",
				"start_date",
				"end_date",
				"state",
				"user{objectId first_name last_name portrait}",
				"comment",
				"type",
				"year"
			]
		}),
		{
			fetchPolicy: "network-only",
			variables: {
				params: { user: { _eq: absenceState.user?.objectId } }
			},
			skip: !absenceState.user
		}
	);

	useEffect(() => {
		if (!editAbsence) {
			setAbsenceState(initialAbsence);
		} else {
			setAbsenceState(type === "edit" ? absence : initialAbsence);
		}
	}, [editAbsence]);

	const createAbsenceHandler = useCallback(async () => {
		const absenceStateCopy = { ...absenceState };
		if (record) {
			if (absenceState?.user?.objectId) {
				let newAbsenceId: string;
				if (type === "edit" && absenceDayData) {
					const absenceDayDataCopy: Day[] = cloneDeep(
						absenceDayData.objects.findDay.results
					);
					if (
						absenceState.start_date !== absence?.start_date ||
						absenceState.end_date !== absence?.end_date
					) {
						const deleteArray = absenceDayDataCopy.map((day) =>
							deleteData({
								objectId: day.objectId,
								className: "Day"
							})
						);
						await Promise.all(deleteArray);
					}

					await updateData({
						className: "Absence",
						objectId: absenceState.objectId,
						updateObject: {
							type: absenceState.type,
							start_date: absenceState.start_date,
							end_date: absenceState.end_date,
							state: absenceState.state,
							comment: absenceState.comment,
							user: {
								__type: "Pointer",
								className: "_User",
								objectId: absenceState?.user?.objectId
							},
							year: absenceState.year,
							created_by: {
								__type: "Pointer",
								className: "_User",
								objectId: user?.objectId
							}
						}
					});
				}
				if (type === "create") {
					await createData({
						className: "Absence",
						updateObject: {
							type: absenceState.type,
							start_date: absenceState.start_date,
							end_date: absenceState.end_date,
							state: absenceState.state,
							comment: absenceState.comment,
							user: {
								__type: "Pointer",
								className: "_User",
								objectId: absenceState?.user?.objectId
							},
							year: absenceState.year,
							created_by: {
								__type: "Pointer",
								className: "_User",
								objectId: user?.objectId
							}
						},
						afterSaveHandler(data) {
							newAbsenceId = data.objectId;
						}
					});
				}

				if (absenceState.state === "approved") {
					const interval = createIntervalFromTimes(
						absenceStateCopy.start_date,
						absenceStateCopy.end_date
					);

					interval.forEach(async (date) => {
						const dayRecord = record;
						const defaultTime = findDefaultTimeForDate(date, [
							record
						]);

						if (dayRecord && defaultTime) {
							const is_working_day = defaultTime.is_working_day;
							await createData({
								className: "Day",
								updateObject: {
									date,
									type: "absence",
									record: {
										__type: "Pointer",
										className: "Record",
										objectId: record.objectId
									},
									user: {
										__type: "Pointer",
										className: "_User",
										objectId: absenceState?.user?.objectId
									},
									absence: {
										__type: "Pointer",
										className: "Absence",
										objectId:
											type === "create"
												? newAbsenceId
												: absenceState.objectId
									},
									default_time: defaultTime.default_time
										? defaultTime.default_time
										: null,
									year: absenceState.year,
									month: new Date(date).getMonth(),
									saldo: is_working_day
										? getSaldo(
												getDefaultTime(date).time,
												defaultTime.default_time
											)
										: 0,
									is_working_day,
									surcharges: []
								}
							});
						}
					});
				}
			}
		}
		refetch();
	}, [absenceState, absenceDayData, record, record, type]);

	useEffect(() => {
		const errors: ErrorMessage[] = [];
		if (!absenceState.user) {
			errors.push({
				message: "Bitte einen Mitarbeiter auswählen",
				id: "select_user",
				key: "select_user"
			});
		} else if (!record) {
			if (!record) {
				errors.push({
					message: "Bitte ein Startdatum wählen",
					id: "no_start_date",
					key: "no_start_date"
				});
			}
			if (!!absenceState.start_date && !record) {
				errors.push({
					message:
						"Für dieses Datum gibt es keinen Eintrag, bitte legen Sie zuerste einen an.",
					id: "no_record_start_date",
					key: "no_record_start_date"
				});
			}
		} else {
			if (
				new Date(absenceState.start_date).getTime() <
				new Date(record.start_date).getTime()
			) {
				errors.push({
					message: `Anfangsdatum muss nach dem ${getDateString(new Date(record?.start_date)).date} liegen`,
					id: "date_too_early",
					key: "date_too_early"
				});
			}

			if (
				new Date(absenceState.start_date).getTime() >
				new Date(record.end_date).getTime()
			) {
				errors.push({
					message: `Anfangsdatum muss vor dem ${getDateString(new Date(record?.end_date)).date} liegen`,
					id: "date_too_early",
					key: "date_too_early"
				});
			}

			if (
				new Date(absenceState.end_date).getTime() <
				new Date(record.start_date).getTime()
			) {
				errors.push({
					message: `Enddatum muss nach dem ${getDateString(new Date(record?.start_date)).date} liegen`,
					id: "date_too_early",
					key: "date_too_early"
				});
			}

			if (
				new Date(absenceState.end_date).getTime() >
				new Date(record.end_date).getTime()
			) {
				errors.push({
					message: `Enddatum muss vor dem ${getDateString(new Date(record?.end_date)).date} liegen`,
					id: "date_too_early",
					key: "date_too_early"
				});
			}

			if (!absenceState.start_date) {
				errors.push({
					message: "Anfangsdatum fehlt",
					id: "start_date",
					key: "start_date"
				});
			}
			if (!absenceState.end_date) {
				errors.push({
					message: "Enddatum fehlt",
					id: "end_date",
					key: "end_date"
				});
			}

			if (!absenceState.type) {
				errors.push({
					message: "Art der Abwesenheit fehlt",
					id: "type",
					key: "type"
				});
			}
			if (
				absenceState.start_date &&
				absenceState.end_date &&
				new Date(absenceState.start_date).getTime() >
					new Date(absenceState.end_date).getTime()
			) {
				errors.push({
					message: "Anfangsdatum muss vor dem Enddatum liegen",
					id: "end_date",
					key: "end_date"
				});
			}
			if (dayData && absenceState.start_date && absenceState.end_date) {
				const days = dayData.objects.findDay.results;
				const conflicts = checkForConflicts(
					absenceState.start_date,
					absenceState.end_date,
					days,
					absence?.objectId
				);
				if (conflicts.length > 0) {
					const conflictDates = conflicts.map(
						(date) => getDateString(new Date(date)).date
					);
					const conflictDatesString = conflictDates.join(", ");
					errors.push({
						message: `Es gibt Überschneidungen mit anderen Einträgen: ${conflictDatesString}`,
						id: "day_conflict",
						key: "day_conflict"
					});
				}
			}
			if (
				absenceState.start_date &&
				absenceState.end_date &&
				userAbsenceData
			) {
				const absences = userAbsenceData.objects.findAbsence.results;
				const conflicts = checkForAbsenceConflicts(
					absenceState.start_date,
					absenceState.end_date,
					absences,
					absence?.objectId
				);
				if (conflicts.length > 0) {
					const conflictDates = conflicts.map(
						(date) => getDateString(new Date(date)).date
					);
					const conflictDatesString = conflictDates.join(", ");
					errors.push({
						message: `Es gibt Überschneidungen mit anderen Abwesenheiten: ${conflictDatesString}`,
						id: "absence_conflict",
						key: "absence_conflict"
					});
				}
			}
		}
		setErrors(errors);
	}, [absenceState, dayData, record, userAbsenceData]);

	const selectOptions = useMemo(() => {
		let staffOptions = [] as { value: string; label: string }[];

		if (staffData) {
			staffOptions = staffData.objects.find_User.results.map(
				(staff: StaffMember) => ({
					value: staff.objectId,
					label: `${staff.first_name} ${staff.last_name}`,
					...staff
				})
			);
		}
		return { staffOptions };
	}, [staffData]);

	return (
		<SlideIn
			isOpen={editAbsence}
			cancel={() => {
				setEditAbsence(false);
			}}
			confirm={async () => {
				await createAbsenceHandler();
				setEditAbsence(false);
				refetch();
			}}
			header={`Abwesenheit anpassen / ${absenceState?.year.toString()}`}
			errors={errors}
			disabled={[loading, errors.length > 0 || loading]}
		>
			<div className="flex col gap-sm">
				<form>
					{type === "create" && staffData && (
						<Select
							label="Mitarbeiter auswählen"
							width="300px"
							options={selectOptions.staffOptions}
							value={
								type === "create"
									? absenceState.user
									: {
											...absenceState.user,
											value: user?.objectId,
											label: `${user?.first_name} ${user?.last_name}`
										}
							}
							onChange={(value) => {
								setAbsenceState({
									...absenceState,
									user: value
								});
							}}
							placeholder="Mitarbeiter..."
						/>
					)}
					{type === "edit" && absenceState.user && (
						<DisplayWorker workerId={absenceState.user.objectId} />
					)}

					<div>
						<DatePicker
							id="dstart"
							defaultValue={absenceState.start_date}
							onChange={(value) => {
								setAbsenceState({
									...absenceState,
									start_date: value
								});
							}}
							disabled={!record || type === "edit"}
							type="date"
							label="Anfangsdatum"
							width={300}
							onlyDate
						/>
					</div>
					<div>
						<DatePicker
							id="end"
							defaultValue={absenceState.end_date}
							onChange={(value) =>
								setAbsenceState({
									...absenceState,
									end_date: value
								})
							}
							disabled={!record || type === "edit" || !absenceState.start_date}
							type="date"
							label="Enddatum"
							width={300}
							onlyDate
						/>
					</div>
					<div>
						<Select
							value={absenceState.type}
							options={absence_type_options}
							onChange={(value) =>
								setAbsenceState({
									...absenceState,
									type: value.value
								})
							}
							placeholder="Art der Abwesenheit"
							label="Art der Abwesenheit"
							width={300}
							isDisabled={!record || type === "edit"}
						/>
					</div>
					<div style={{ position: "relative" }}>
						<Select
							value={absenceState.state}
							options={absence_state_options}
							onChange={(value) =>
								setAbsenceState({
									...absenceState,
									state: value.value
								})
							}
							placeholder="Status"
							label="Status"
							width={300}
							isDisabled={
								!absenceState.end_date ||
								!absenceState.start_date ||
								absenceState.state === "approved"
							}
						/>
						{/* {type === 'edit' && absence.state === 'approved' && <InfoBox text='Eine bereits bestätigte Abwesenheit kann nicht bestätigt werden. Bitte die Abwesenheit löschen und eine neue erstellen.' /> } */}
					</div>
					<div>
						<TextInput
							id="comment"
							defaultValue={absenceState.comment}
							onChange={(value) =>
								setAbsenceState({
									...absenceState,
									comment: value
								})
							}
							label="Kommentar"
							placeholder="Kommentar"
							isTextArea
							width={"300px"}
						/>
					</div>
				</form>
			</div>
		</SlideIn>
	);
};

export default EditRecordAbsence;
