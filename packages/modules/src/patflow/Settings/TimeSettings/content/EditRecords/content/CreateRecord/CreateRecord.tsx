import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { CreateRecordProps } from "./types";
import {
	createInitialTimes,
	getHolidayDates,
	useDataHandler,
	useDataStore,
	useFindData
} from "@repo/provider";
import { ErrorMessage, HolidayTemplate, Record } from "@repo/types";
import styles from "./CreateRecord.module.scss";
import defaultRecord from "./constants/defaultRecord";
import { CREATE_RECORD_STEPS } from "./constants/steps";
import { oneDayBefore } from "./functions/dateHelpers";
import {
	applyRecordToFormState,
	buildEditableTimeSettings,
	getNextStepIndex,
	getPreviousStepIndex,
	isRecordEditable,
	parseRecordBreaks,
	TIME_SETTINGS_STEP_INDEX
} from "./functions/recordFormState";
import { Modal, Steps } from "@repo/ui";
import {
	CreateRecordEmployee,
	CreateRecordImportSource,
	CreateRecordStartDate,
	CreateRecordSurchargesAndHolidays,
	CreateRecordTimeSettings
} from "./components";

const CreateRecord: FC<CreateRecordProps> = ({
	createRecord,
	setCreateRecord,
	userId,
	refetch,
	projectId,
	person
}) => {
	const currentYear = new Date().getFullYear();
	const nextYearStartDate = `${currentYear + 1}-01-01`;

	const [step, setStep] = useState(0);
	const [edit, setEdit] = useState<Record | null>(null);
	const [startDate, setStartDate] = useState<string>("");
	const [year, setYear] = useState<number>(currentYear);
	const [importMode, setImportMode] = useState<"new" | "import">("new");
	const [nextRecord, setNextRecord] = useState<Partial<Record>>(
		defaultRecord(currentYear)
	);
	const [surcharges, setSurcharges] = useState<string[]>([]);
	const [breaks, setBreaks] = useState<
		{ start: string; end: string; id: string }[]
	>([]);
	const [errors, setErrors] = useState<ErrorMessage[]>([]);

	const isEditing = edit !== null;

	const { createData, updateData } = useDataHandler();
	const { surcharges: surchargeData } = useDataStore();

	const { data: allUserRecords } = useFindData({
		objectName: "Record",
		fields: [
			"objectId",
			"year",
			"start_date",
			"end_date",
			"time_settings",
			"holiday_template {objectId name}",
			"surcharges",
			"former_record {objectId}"
		],
		userId: userId
	});

	const userRecords = useMemo(
		() => (allUserRecords as Record[] | undefined) ?? [],
		[allUserRecords]
	);

	const { data: holidayTemplateData } = useFindData({
		objectName: "Template",
		fields: ["objectId", "name", "type", "holidays"],
		filters: [{ key: "type", value: "holiday", operator: "equalTo" }],
		projectId: projectId
	});

	const { data: holidayData } = useFindData({
		objectName: "Holiday",
		fields: ["objectId", "name", "type", "dates"],
		filters: [{ key: "type", value: "holiday", operator: "equalTo" }],
		projectId: projectId
	});

	const existingStartDates = useMemo(
		() => new Set(userRecords.map((r) => r.start_date)),
		[userRecords]
	);

	const nextYearRecord = useMemo(
		() =>
			userRecords.find((r) => r.start_date === nextYearStartDate) ?? null,
		[userRecords, nextYearStartDate]
	);

	const conflictingRecord = useMemo(() => {
		if (isEditing || !startDate || !userRecords.length) return null;
		return (
			userRecords.find(
				(r) => startDate > r.start_date && startDate <= r.end_date
			) ?? null
		);
	}, [startDate, userRecords, isEditing]);

	const latestRecord = useMemo(() => {
		if (!userRecords.length) return null;
		return [...userRecords].sort((a, b) =>
			b.start_date.localeCompare(a.start_date)
		)[0] as Record;
	}, [userRecords]);

	const surchargeElements = useMemo(
		() =>
			surchargeData
				.filter((s) => s.active)
				.map((s) => ({ label: s.name, value: s.objectId })),
		[surchargeData]
	);

	const holidayTemplateElements = useMemo(
		() =>
			holidayTemplateData?.map((t: HolidayTemplate) => ({
				label: t.name,
				value: t.objectId
			})) ?? [],
		[holidayTemplateData]
	);

	const resetFormState = useCallback(() => {
		setStep(0);
		setEdit(null);
		setStartDate("");
		setImportMode("new");
		setSurcharges([]);
		setBreaks([]);
		setYear(currentYear);
		setNextRecord(defaultRecord(currentYear));
	}, [currentYear]);

	const handleEditRecord = useCallback(
		(record: Record) => {
			if (!isRecordEditable(record, currentYear)) return;

			const formState = applyRecordToFormState(record);
			setEdit(record);
			setYear(formState.year);
			setStartDate(formState.startDate);
			setNextRecord(formState.nextRecord);
			setSurcharges(formState.surcharges);
			setBreaks(formState.breaks);
			setImportMode(record.former_record ? "import" : "new");
			setStep(TIME_SETTINGS_STEP_INDEX);
		},
		[currentYear]
	);

	const handleStartDateSelect = (date: string) => {
		const y = parseInt(date.split("-")[0] ?? String(currentYear));
		setYear(y);
		setStartDate(date);
		setEdit(null);
		setNextRecord((prev) => ({
			...prev,
			year: y,
			start_date: date,
			end_date: `${y}-12-31`
		}));
	};

	const handleImportModeSelect = (mode: "new" | "import") => {
		setImportMode(mode);
		if (mode === "import" && latestRecord) {
			setBreaks(parseRecordBreaks(latestRecord));
			setNextRecord((prev) => ({
				...prev,
				time_settings: latestRecord.time_settings,
				holiday_template: latestRecord.holiday_template
			}));
			setSurcharges(latestRecord.surcharges ?? []);
		} else {
			setBreaks([]);
			setNextRecord((prev) => ({
				...prev,
				time_settings: defaultRecord(year).time_settings,
				holiday_template: undefined
			}));
			setSurcharges([]);
		}
	};

	const createRecordHandler = useCallback(async () => {
		if (
			!nextRecord?.time_settings ||
			!nextRecord?.start_date ||
			!nextRecord?.end_date ||
			!nextRecord?.holiday_template
		)
			return;
		console.log({ nextRecord });
		if (conflictingRecord && startDate) {
			await updateData({
				className: "Record",
				objectId: conflictingRecord.objectId,
				updateObject: { end_date: oneDayBefore(startDate) }
			});
		}

		const holidayDates = getHolidayDates(year, holidayData ?? []);

		const { default_times } = createInitialTimes({
			start_date: nextRecord.start_date,
			end_date: nextRecord.end_date,
			timeSettings: nextRecord.time_settings,
			holidays: holidayDates || []
		});

		await createData({
			className: "Record",
			updateObject: {
				user: {
					__type: "Pointer",
					className: "_User",
					objectId: userId
				},
				year,
				start_date: nextRecord.start_date,
				end_date: nextRecord.end_date,
				default_times,
				absence: [],
				former_record:
					importMode === "import" && latestRecord
						? {
								__type: "Pointer",
								className: "Record",
								objectId: latestRecord.objectId
							}
						: null,
				time_settings: nextRecord.time_settings,
				saldo: 0,
				vacation: 0,
				absence_days: 0,
				holiday_template: {
					__type: "Pointer",
					className: "Template",
					objectId: nextRecord.holiday_template.objectId
				},
				surcharges
			}
		});

		resetFormState();
		setCreateRecord(false);
		refetch();
	}, [
		year,
		importMode,
		latestRecord,
		conflictingRecord,
		startDate,
		nextRecord,
		userId,
		holidayData,
		surcharges,
		createData,
		updateData,
		resetFormState,
		setCreateRecord,
		refetch
	]);

	const updateRecordHandler = useCallback(async () => {
		if (!edit?.objectId || !nextRecord?.time_settings) return;

		await updateData({
			className: "Record",
			objectId: edit.objectId,
			updateObject: {
				time_settings: buildEditableTimeSettings(
					edit.time_settings,
					nextRecord.time_settings,
					true
				)
			},
			feedback: "Zeiterfassung aktualisiert"
		});

		resetFormState();
		setCreateRecord(false);
		refetch();
	}, [
		edit,
		nextRecord,
		updateData,
		resetFormState,
		setCreateRecord,
		refetch
	]);

	useEffect(() => {
		const errorArray: ErrorMessage[] = [];
		if (!isEditing && step === 1 && !startDate) {
			errorArray.push({
				message: "Bitte ein Startdatum auswählen",
				key: "start_date",
				id: "start_date"
			});
		}
		if (!isEditing && step === 4 && !nextRecord.holiday_template) {
			errorArray.push({
				message: "Bitte ein Feiertag-Template auswählen",
				key: "holiday_template",
				id: "holiday_template"
			});
		}
		setErrors(errorArray);
	}, [step, startDate, nextRecord, isEditing]);

	const canAdvance = useMemo(() => {
		if (isEditing) return true;
		if (step === 1) return !!startDate;
		if (step === 4) return !!nextRecord.holiday_template;
		return true;
	}, [step, startDate, nextRecord, isEditing]);

	const isLastStep = step === CREATE_RECORD_STEPS.length - 1;

	const handleConfirm = () => {
		if (isLastStep) {
			if (isEditing) {
				updateRecordHandler();
			} else {
				createRecordHandler();
			}
		} else {
			setStep((current) => getNextStepIndex(current, isEditing));
		}
	};

	const handleClose = () => {
		resetFormState();
		setCreateRecord(false);
	};

	const renderStep = () => {
		switch (step) {
			case 0:
				return (
					<CreateRecordEmployee
						person={person}
						records={userRecords}
						currentYear={currentYear}
						nextYearStartDate={nextYearStartDate}
						nextYearRecord={nextYearRecord}
						onEditRecord={handleEditRecord}
					/>
				);
			case 1:
				return (
					<CreateRecordStartDate
						currentYear={currentYear}
						startDate={startDate}
						existingStartDates={existingStartDates}
						conflictingRecord={conflictingRecord}
						onSelect={handleStartDateSelect}
						isEditing={isEditing}
						nextYearStartDate={nextYearStartDate}
						nextYearRecord={nextYearRecord}
						onEditRecord={handleEditRecord}
					/>
				);
			case 2:
				return (
					<CreateRecordImportSource
						importMode={importMode}
						latestRecord={latestRecord}
						onSelect={handleImportModeSelect}
						isEditing={isEditing}
					/>
				);
			case 3:
				return (
					<CreateRecordTimeSettings
						nextRecord={nextRecord}
						setNextRecord={setNextRecord}
						breaks={breaks}
						setBreaks={setBreaks}
						isEditing={isEditing}
					/>
				);
			case 4:
				return (
					<CreateRecordSurchargesAndHolidays
						surcharges={surcharges}
						surchargeElements={surchargeElements}
						holidayTemplateElements={holidayTemplateElements}
						holidayTemplateData={holidayTemplateData}
						nextRecord={nextRecord}
						setSurcharges={setSurcharges}
						setNextRecord={setNextRecord}
						isEditing={isEditing}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<Modal
			isOpen={createRecord}
			cancelButtonHandler={handleClose}
			confirmButtonHandler={handleConfirm}
			confirmButtonText={
				isLastStep
					? isEditing
						? "Speichern"
						: "Zeiterfassung anlegen"
					: "Weiter"
			}
			header={
				isEditing
					? "Zeiterfassung bearbeiten"
					: "Neue Zeiterfassung anlegen"
			}
			buttonDisabled={[false, !canAdvance]}
			errors={errors}
		>
			<div className={styles.create_record_content}>
				<div className={styles.steps_container}>
					<Steps steps={[...CREATE_RECORD_STEPS]} step={step} />
				</div>
				<div className={styles.step_body}>
					{renderStep()}
					{step > 0 && (
						<div className={styles.back_button_row}>
							<button
								type="button"
								className="secondary sm"
								onClick={() =>
									setStep((current) =>
										getPreviousStepIndex(current, isEditing)
									)
								}
							>
								← Zurück
							</button>
						</div>
					)}
				</div>
			</div>
		</Modal>
	);
};

export default CreateRecord;
