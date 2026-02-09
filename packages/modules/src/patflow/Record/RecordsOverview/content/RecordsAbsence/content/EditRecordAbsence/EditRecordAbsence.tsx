import {
	createIntervalFromTimes,
	findDefaultTimeForDate,
	getSaldo,
	getDefaultTime,
	PatflowAppContext,
	useGetActiveRecord,
	UserContext,
	useFindData
} from "@repo/provider";
import { useDataHandler } from "@repo/provider";
import { useCallback, useContext, useEffect, useState } from "react";
import { EditRecordAbsenceComponent, InitialAbsence } from "./types";
import { Day } from "@repo/types";
import { cloneDeep } from "lodash-es";
import initialAbsence from "./constants/initialAbsence";
import { SlideIn } from "@repo/ui";
import useErrors from "./hooks/useErrors";
import EditAbsence from "./components/EditAbsence";

const EditRecordAbsence = ({
	refetch,
	type,
	absence,
	editAbsence,
	setEditAbsence
}: EditRecordAbsenceComponent) => {
	const { year } = useContext(PatflowAppContext);
	const [absenceState, setAbsenceState] = useState<InitialAbsence>(
		type === "edit" ? absence : { ...initialAbsence, year }
	);

	const { data: staffData } = useFindData({
		objectName: "User",
		fields: [
			"objectId",
			"first_name",
			"last_name",
			"is_worker",
			"portrait",
			"color",
			"time_settings",
			"number",
			"data",
			"role { objectId name type color }"
		],
		filters: [
			{
				key: "is_worker",
				value: true,
				operator: "equalTo"
			}
		],
		order: "last_name_DESC"
	});
	const { user } = useContext(UserContext);
	const { record } = useGetActiveRecord({
		year,
		userId: absenceState?.user?.objectId as string
	});

	const { updateData, createData, deleteData, loading } = useDataHandler();
	const { data: dayData } = useFindData({
		objectName: "Day",
		fields: [
			"objectId",
			"year",
			"month",
			"date",
			"is_working_day",
			"time",
			"default_time",
			"surcharges",
			"iso_date",
			"absence { objectId start_date end_date state type }",
			"saldo",
			"type",
			"iso_date",
			"user { objectId }",
			"record { objectId }"
		],
		userId: absenceState?.user?.objectId,
		skipQuery: !absenceState?.user
	});

	const { data: absenceDayData } = useFindData({
		objectName: "Day",
		fields: [
			"objectId",
			"year",
			"month",
			"date",
			"is_working_day",
			"time",
			"default_time",
			"surcharges",
			"iso_date",
			"absence { objectId start_date end_date state type }",
			"saldo",
			"type",
			"iso_date",
			"user { objectId }",
			"record { objectId }"
		],
		filters: [
			{
				key: "absence",
				value: absence?.objectId as string,
				operator: "equalTo"
			}
		],
		skipQuery: !absence
	});

	const { data: userAbsenceData } = useFindData({
		objectName: "Absence",
		fields: [
			"objectId",
			"start_date",
			"end_date",
			"state",
			"user {objectId first_name last_name portrait}",
			"comment",
			"type",
			"year"
		],
		userId: absenceState?.user?.objectId,
		skipQuery: !absenceState?.user
	});

	useEffect(() => {
		if (!editAbsence) {
			setAbsenceState(initialAbsence);
		} else {
			setAbsenceState(type === "edit" ? absence : initialAbsence);
		}
	}, [editAbsence]);

	const { errors } = useErrors({
		absenceState,
		record,
		dayData,
		userAbsenceData,
		absence: absence || null
	});
	const createAbsenceHandler = useCallback(async () => {
		const absenceStateCopy = { ...absenceState };
		if (record) {
			if (absenceState?.user?.objectId) {
				let newAbsenceId: string;
				if (type === "edit" && absenceDayData) {
					const absenceDayDataCopy: Day[] = cloneDeep(
						absenceDayData || []
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
							year: record.year,
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
			<EditAbsence
				type={type}
				staffData={staffData}
				user={user}
				absenceState={absenceState}
				setAbsenceState={setAbsenceState}
				record={record}
			/>
		</SlideIn>
	);
};

export default EditRecordAbsence;
