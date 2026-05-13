import { FC, useEffect, useState, useMemo } from "react";
import {
	DatePicker,
	DisplayWorker,
	Divider,
	LoadingIndicator,
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
	useGetData
} from "@repo/provider";
import initialAbsence from "./constants/initialAbsence";
import { useAbsenceDays, useErrors } from "./hooks";
import AbsenceDay from "./components/AbsenceDay";
import { ErrorMessage } from "@repo/types";

const EditDayAbsence: FC<EditDayAbsenceProps> = ({
	type,
	absenceId,
	date,
	days,
	times,
	records,
	workerId,
	year,
	isOpen,
	setIsOpen
}) => {
	const [isFull, setIsFull] = useState(true);
	const [errors, setErrors] = useState<ErrorMessage[]>([]);
	const [overlap, setOverlap] = useState<string[]>([]);
	const { default_time } = findDefaultTimeForDate(date, records);

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

	const { daysLoading, intervalDays } = useAbsenceDays({
		absence: absenceState || undefined
	});

	console.log({ absenceState });

	useErrors({
		date,
		dayType: "absence",
		absence: absenceState || undefined,
		days,
		setErrors,
		setOverlap,
		records,
		isFull
	});

	console.log({ daysLoading });
	console.log({ default_time });

	useEffect(() => {
		if (absence && !absenceState.objectId) {
			console.log({ absence });
			setAbsenceState(absence);
		}
	}, [absence, absenceState]);

	useEffect(() => {
		if (isFull === false) {
			setAbsenceState({
				...absenceState,
				start_date: default_time?.start || date,
				end_date: default_time?.end || date
			});
		} else if (isFull === true) {
			setAbsenceState({
				...absenceState,
				start_date: date,
				end_date: date
			});
		}
	}, [isFull, default_time]);

	const secondaryContent = useMemo(() => {
		return (
			<div>
				<h3>Zeiten/ Tage</h3>
				<Divider />
				<AbsenceDay days={intervalDays} overlap={overlap} />
			</div>
		);
	}, [intervalDays]);

	if (absenceLoading) {
		return <LoadingIndicator />;
	}

	return (
		<SlideIn
			isOpen={isOpen}
			cancel={() => setIsOpen(false)}
			confirm={() => {}}
			header="Abwesenheit bearbeiten"
			showSecondaryContent={true}
			secondaryContent={secondaryContent}
			errors={errors}
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
				<div className="horizontal_container">
					<div className={"label"}>Ganztägig</div>
					<StatelessToggle
						onChange={(value) => {
							if (typeof value === "boolean") {
								if (value === true) {
									setIsFull(true);
								} else {
									setIsFull(false);
								}
							}
						}}
						value={isFull}
						disabled={type === "edit"}
					/>
				</div>
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
						disabled={false}
						disabledDate={isFull === false}
						type={isFull ? "date" : "datetime"}
						label="Anfangsdatum"
						width={300}
						onlyDate
					/>
				</div>
				<div>
					<DatePicker
						key={absenceState.end_date}
						id="end"
						defaultValue={absenceState.end_date}
						onChange={(value) =>
							setAbsenceState({
								...absenceState,
								end_date: value
							})
						}
						disabled={!absenceState.start_date}
						disabledDate={isFull === false}
						type={isFull ? "date" : "datetime"}
						label="Enddatum"
						width={300}
						onlyDate
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
	);
};

export default EditDayAbsence;
