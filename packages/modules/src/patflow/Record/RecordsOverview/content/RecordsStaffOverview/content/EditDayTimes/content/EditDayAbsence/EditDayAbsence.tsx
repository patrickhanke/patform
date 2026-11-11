"use client";

import { FC, useEffect, useState, useCallback, useContext } from "react";
import {
	DisplayWorker,
	Divider,
	LoadingIndicator,
	Modal,
	Select,
	SlideIn,
	StatelessToggle,
	TextInput
} from "@repo/ui";
import { useDebounceCallback } from "usehooks-ts";
import { EditDayAbsenceProps, InitialAbsence } from "./types";
import {
	absence_state_options,
	absence_type_options,
	axiosclient,
	findDefaultTimeForDate,
	PatflowAppContext,
	useDataHandler,
	useGetData
} from "@repo/provider";
import initialAbsence from "./constants/initialAbsence";
import { useAbsenceDays, useCreateAbsence, useErrors } from "./hooks";
import AbsenceDay from "./components/AbsenceDay";
import { ErrorMessage } from "@repo/types";
import { outOfBounds } from "./functions";

const toDateInputValue = (value: string): string => {
	if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
		return value;
	}
	if (value.includes("T")) {
		return value.slice(0, 10);
	}
	return "";
};

// datetime-local rejects timezone suffixes and millisecond precision, and
// Chrome then fires a change that rewrites the stored value.
const toDateTimeLocalValue = (value: string): string => {
	if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(value)) {
		return value;
	}

	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) {
		return "";
	}

	const pad = (part: number) => String(part).padStart(2, "0");
	return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}T${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`;
};

const EditDayAbsence: FC<EditDayAbsenceProps> = ({
	type,
	dayId,
	absenceId,
	date,
	days,
	times,
	records,
	workerId,
	isOpen,
	setIsOpen,
	refetch
}) => {
	const { year } = useContext(PatflowAppContext);
	const { deleteData } = useDataHandler();
	const [deleteModal, setDeleteModal] = useState(false);
	const [isFull, setIsFull] = useState(true);
	const [errors, setErrors] = useState<ErrorMessage[]>([]);
	const [overlap, setOverlap] = useState<string[]>([]);
	const { default_time } = findDefaultTimeForDate(date, records);
	const [loading, setLoading] = useState(false);
	const { data: absence, loading: absenceLoading } = useGetData({
		objectName: "Absence",
		fields: [
			"objectId",
			"start_date",
			"end_date",
			"state",
			"comment",
			"type",
			"approved_by { objectId first_name last_name portrait { name url } }"
		],
		id: absenceId,
		skip: !absenceId || !isOpen
	});

	const [absenceState, setAbsenceState] = useState<InitialAbsence>({
		...initialAbsence,
		year,
		start_date: date,
		end_date: date
	});

	const updateAbsenceDate = useCallback(
		(key: "start_date" | "end_date", value: string) => {
			if (!value) {
				return;
			}
			if (outOfBounds({ date: value, year })) {
				setErrors((current) => {
					if (current.some((error) => error.id === "out_of_bounds")) {
						return current;
					}
					return [
						...current,
						{
							id: "out_of_bounds",
							key: "out_of_bounds",
							message: "Das Datum liegt außerhalb des Jahres"
						}
					];
				});
				return;
			}
			setAbsenceState((current) => ({
				...current,
				[key]: value
			}));
		},
		[year]
	);
	const debouncedStartChange = useDebounceCallback(updateAbsenceDate, 600);
	const debouncedEndChange = useDebounceCallback(updateAbsenceDate, 600);

	const { intervalDays, daysData } = useAbsenceDays({
		absence: absenceState || undefined,
		days: days || [],
		isFull
	});

	useErrors({
		date,
		dayId,
		dayType: "absence",
		absence: absenceState,
		days,
		setErrors,
		setOverlap,
		records,
		isFull
	});

	const { editAbsenceHandler, createAbsenceHandler } = useCreateAbsence({
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
	});

	const resetStateHandler = useCallback(() => {
		setAbsenceState({
			...initialAbsence,
			year,
			start_date: date,
			end_date: date
		});
		setIsFull(true);
		setErrors([]);
		setOverlap([]);
		setDeleteModal(false);
		setLoading(false);
		setIsOpen(false);
	}, [year, date, setIsOpen]);

	const slideInHandler = useCallback(async () => {
		setLoading(true);
		if (type === "edit") {
			await editAbsenceHandler();
		} else if (type === "create") {
			await createAbsenceHandler();
		}
		refetch();
		resetStateHandler();
	}, [
		type,
		editAbsenceHandler,
		createAbsenceHandler,
		refetch,
		resetStateHandler
	]);

	useEffect(() => {
		if (absence && !absenceState.objectId) {
			if (
				typeof absence.start_date === "string" &&
				absence.start_date.length > 10
			) {
				setIsFull(false);
			}
			setAbsenceState(absence);
		}
	}, [absence, absenceState]);

	const secondaryContent = (
		<div className="flex col j-sb gap-md h-100">
			<div>
				<h3>Zeiten/ Tage</h3>
				<Divider />
				<AbsenceDay
					days={intervalDays}
					overlap={overlap}
					startAfterEnd={
						!!errors.find((error) => error.id === "start_after_end")
					}
				/>
			</div>
			<div>
				{type === "edit" && (
					<button
						className="full_button md red"
						onClick={() => setDeleteModal(true)}
					>
						Abwesenheit löschen
					</button>
				)}
			</div>
		</div>
	);

	const formReady = type === "create" || Boolean(absenceState.objectId);

	return (
		<>
			<SlideIn
				isOpen={isOpen}
				cancel={resetStateHandler}
				confirm={slideInHandler}
				header="Abwesenheit bearbeiten"
				showSecondaryContent={true}
				secondaryContent={secondaryContent}
				errors={errors}
				disabled={[loading, errors.length > 0 || loading]}
				loading={loading}
				preventClickOutside
			>
				{absenceLoading || !formReady ? (
					<LoadingIndicator />
				) : (
					<form className="flex col gap-lg">
						<div>
							<label htmlFor="worker">Mitarbeiter</label>
							<DisplayWorker workerId={workerId} />
						</div>
						{absenceState.approved_by && (
							<div>
								<label htmlFor="approved_by">
									Genehmigt von
								</label>
								<DisplayWorker
									workerId={absence?.approved_by?.objectId}
								/>
							</div>
						)}
						<div>
							<Select
								key={absenceState.type}
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
								isDisabled={type === "edit"}
							/>
						</div>
						<div>
							<div className={"label"}>Ganztägig</div>
							<div className="divider small" />
							<StatelessToggle
								onChange={(value) => {
									if (typeof value === "boolean") {
										if (value === true) {
											setIsFull(true);
											setAbsenceState({
												...absenceState,
												start_date: date,
												end_date: date
											});
										} else {
											setIsFull(false);
											setAbsenceState({
												...absenceState,
												start_date:
													default_time?.start || date,
												end_date:
													default_time?.end || date
											});
										}
									}
								}}
								value={isFull}
								disabled={type === "edit"}
							/>
						</div>
						<div>
							<label htmlFor="start">Anfangsdatum</label>
							<div className="light_box">
								<input
									key={
										isFull ? "start-date" : "start-datetime"
									}
									aria-label="Anfangsdatum"
									id="dstart"
									name="dstart"
									type={isFull ? "date" : "datetime-local"}
									style={{ width: 300 }}
									onChange={(event) => {
										if (event.target.value) {
											debouncedStartChange(
												"start_date",
												event.target.value
											);
										}
									}}
									defaultValue={
										isFull
											? toDateInputValue(
													absenceState.start_date
												)
											: toDateTimeLocalValue(
													absenceState.start_date
												)
									}
									step={undefined}
									disabled={false}
								/>
							</div>
						</div>
						<div>
							<label htmlFor="end">Enddatum</label>
							<div className="light_box">
								<input
									key={isFull ? "end-date" : "end-datetime"}
									aria-label="Enddatum"
									id="end"
									name="end"
									type={isFull ? "date" : "datetime-local"}
									style={{ width: 300 }}
									onChange={(event) => {
										if (event.target.value) {
											debouncedEndChange(
												"end_date",
												event.target.value
											);
										}
									}}
									defaultValue={
										isFull
											? toDateInputValue(
													absenceState.end_date
												)
											: toDateTimeLocalValue(
													absenceState.end_date
												)
									}
									step={undefined}
									disabled={!absenceState.start_date}
								/>
							</div>
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
						</div>
						<div>
							<TextInput
								id="comment"
								defaultValue={absenceState?.comment}
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
				)}
			</SlideIn>
			<Modal
				header="Abwesenheit löschen"
				isOpen={deleteModal}
				confirmButtonHandler={async () => {
					if (absenceId) {
						await deleteData({
							className: "Absence",
							objectId: absenceId
						});
					}

					// update days with do not belong to the absence
					if (days && days.length > 1) {
						const otherDays = days.filter(
							(day) =>
								day.absence?.objectId !== absenceId &&
								day.date === date
						);
						otherDays.forEach((day) =>
							axiosclient().post(`/functions/create-time`, {
								time: day.time,
								date: day.date,
								day_id: day.objectId,
								user_id: workerId,
								type: day.type,
								comment: day.comment
							})
						);
					}
					await refetch();
					setDeleteModal(false);
				}}
				loading={loading}
				cancelButtonHandler={() => setDeleteModal(false)}
			>
				<p>
					Sind Sie sicher, dass Sie die Abwesenheit löschen möchten?
					Alle dazugehörigen Zeiteinträge werden ebenfalls gelöscht.
				</p>
			</Modal>
		</>
	);
};

export default EditDayAbsence;
