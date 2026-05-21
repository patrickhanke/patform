import { FC, useEffect, useState, useCallback } from "react";
import {
	DatePicker,
	DisplayWorker,
	Divider,
	IconButton,
	LoadingIndicator,
	Modal,
	Select,
	SlideIn,
	StatelessToggle,
	TextInput
} from "@repo/ui";
import { EditDayAbsenceProps, InitialAbsence } from "./types";
import {
	absence_state_options,
	absence_type_options,
	findDefaultTimeForDate,
	useDataHandler,
	useGetData
} from "@repo/provider";
import initialAbsence from "./constants/initialAbsence";
import { useAbsenceDays, useCreateAbsence, useErrors } from "./hooks";
import AbsenceDay from "./components/AbsenceDay";
import { ErrorMessage } from "@repo/types";
import { outOfBounds } from "./functions";

const EditDayAbsence: FC<EditDayAbsenceProps> = ({
	type,
	dayId,
	absenceId,
	date,
	days,
	times,
	records,
	workerId,
	year,
	isOpen,
	setIsOpen,
	refetch
}) => {
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
			"type"
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
			if (absence.start_date.length > 10) {
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
				<AbsenceDay days={intervalDays} overlap={overlap} />
			</div>
			<div>
				<IconButton
					icon="delete"
					text="Abwesenheit löschen"
					onClick={() => setDeleteModal(true)}
					color="red"
					size={12}
				/>
			</div>
		</div>
	);

	if (absenceLoading) {
		return <LoadingIndicator />;
	}

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
				disabled={[errors.length > 0 || loading, loading]}
			>
				<form className="flex col gap-lg">
					<DisplayWorker workerId={workerId} />
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
											end_date: default_time?.end || date
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
							<DatePicker
								key={absenceState.start_date}
								id="dstart"
								defaultValue={absenceState.start_date}
								onChange={(value) => {
									if (value) {
										if (
											outOfBounds({ date: value, year })
										) {
											setErrors([
												...errors,
												{
													id: "out_of_bounds",
													key: "out_of_bounds",
													message:
														"Das Datum liegt außerhalb des Jahres"
												}
											]);
											return;
										}
										setAbsenceState({
											...absenceState,
											start_date: value
										});
									}
								}}
								disabled={false}
								disabledDate={isFull === false}
								type={isFull ? "date" : "datetime"}
								label=""
								width={300}
								onlyDate
							/>
						</div>
					</div>
					<div>
						<label htmlFor="end">Enddatum</label>
						<div className="light_box">
							<DatePicker
								key={absenceState.end_date}
								id="end"
								defaultValue={absenceState.end_date}
								onChange={(value) => {
									if (value) {
										if (
											outOfBounds({ date: value, year })
										) {
											setErrors([
												...errors,
												{
													id: "out_of_bounds",
													key: "out_of_bounds",
													message:
														"Das Datum liegt außerhalb des Jahres"
												}
											]);
											return;
										}
										setAbsenceState({
											...absenceState,
											end_date: value
										});
									}
								}}
								disabled={!absenceState.start_date}
								disabledDate={isFull === false}
								type={isFull ? "date" : "datetime"}
								label=""
								width={300}
								onlyDate
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
						{/* {type === 'edit' && absence.state === 'approved' && <InfoBox text='Eine bereits bestätigte Abwesenheit kann nicht bestätigt werden. Bitte die Abwesenheit löschen und eine neue erstellen.' /> } */}
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
				{/* <div>
				<SwitchButtons
					buttonStates={[...absence_type_options]}
					currentStates={
						absence_type_options.find(
							(option) => option.value === time.type
						) || absence_type_options[0]
					}
					changeHandler={absenceTypeChangeHandler}
				/>
			</div>
			<Divider size="small" showLine={false} />
			<h3>
				{absence_type_options.find(
					(option) => option.value === time.type
				)?.title || absence_type_options[0].title}
			</h3>
			{time.type === "vacation" && (
				<AddEditVacation date={date} records={records} />
			)}
			{time.type === "compensation_times" && (
				<AddEditCompensationTimes
					date={date}
					time={time}
					timeChangeHandler={absenceChangeHandler}
					defaultTime={defaultTime?.default_time}
				/>
			)}
			{time.type === "illness" && (
				<AddEditDaySick
					date={date}
					time={time}
					timeChangeHandler={absenceChangeHandler}
				/>
			)}
			{time.type === "payed_absence" && (
				<AddEditPayedAbsence
					date={date}
					time={time}
					timeChangeHandler={absenceChangeHandler}
				/>
			)} */}
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
