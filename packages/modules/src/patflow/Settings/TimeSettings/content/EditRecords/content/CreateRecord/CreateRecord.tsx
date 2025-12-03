import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { CreateRecordProps } from "./types";
import { useQuery } from "@apollo/client";
import { find_records_for_user } from "@repo/provider";
import {
	ErrorMessage,
	Holiday,
	HolidayTemplate,
	Record,
	RecordTimeSettings
} from "@repo/types";
import styles from "./CreateRecord.module.scss";
import { createInitialTimes, getHolidayDates } from "@repo/provider";
import { generateGraphQLQuery, useDataHandler } from "@repo/provider";
import RecordSettings from "./components/RecordSettings";
import defaultRecord from "./constants/defaultRecord";
import { cloneDeep } from "lodash-es";
import {
	Divider,
	Form,
	PersonDisplay,
	SlideIn,
	SwitchButtons,
	SwitchButton
} from "@repo/ui";

const CreateRecord: FC<CreateRecordProps> = ({
	createRecord,
	setCreateRecord,
	userId,
	timeSettings,
	refetch,
	projectId,
	person
}) => {
	const [disabled, setDisabled] = useState<[boolean, boolean]>([
		false,
		false
	]);
	const [year, setYear] = useState(new Date().getFullYear() + 1);
	const [adobt, setAdobt] = useState(false);
	const [activeRecord, setActiveRecord] = useState<Record | null>(null);
	const [nextRecord, setNextRecord] = useState<Partial<Record>>(
		defaultRecord(year)
	);
	const [errors, setErrors] = useState<ErrorMessage[]>([]);
	const { data, loading } = useQuery(find_records_for_user, {
		variables: { user: userId }
	});

	useEffect(() => {
		if (data) {
			const records: Record[] = cloneDeep(
				data.objects.findRecord.results
			);
			if (records !== undefined) {
				if (records.length === 0) {
					setYear(new Date().getFullYear());
				} else if (records.length > 0) {
					const sortedRecords = records.sort(
						(a, b) => a.year - b.year
					);
					if (sortedRecords[0]?.year) {
						setYear(sortedRecords[0]?.year);
					} else {
						setYear(new Date().getFullYear());
					}
				}
			}
		}
	}, [data]);

	useEffect(() => {
		if (year && data) {
			setActiveRecord(
				data?.objects.findRecord.results.find(
					(record: Record) => record.year === year - 1
				) || null
			);
		}
	}, [data]);

	useEffect(() => {
		if (year !== nextRecord.year) {
			setNextRecord({
				...nextRecord,
				year,
				start_date: `${year}-01-01`,
				end_date: `${year}-12-31`
			});
		}
	}, [year, nextRecord]);

	const { data: holidayTemplateData } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Template",
			fields: ["objectId", "name", "type", "holidays"]
		}),
		{
			variables: {
				params: {
					type: { _eq: "holiday" },
					project: { _eq: projectId }
				}
			}
		}
	);

	const { data: holidayData } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Holiday",
			fields: ["objectId", "name", "type", "dates"]
		}),
		{
			variables: {
				params: {
					type: { _eq: "holiday" },
					project: { _eq: projectId }
				}
			}
		}
	);

	const { createData } = useDataHandler();

	const buttonStates = useMemo(() => {
		const stateArray: {
			value: number;
			label: string;
			disabled: boolean;
		}[] = [];
		for (let i = 0; i < 5; i += 1) {
			const year = new Date().getFullYear() + i;
			stateArray.push({
				value: year,
				label: year.toString(),
				disabled: data?.objects.findRecord.results.some(
					(record: Record) => record.year === year
				)
			});
		}

		return stateArray;
	}, [data]);

	const adobtButtonOptions: { label: string; value: boolean }[] = useMemo(
		() => [
			{
				label: "Eintrag übernehmen",
				value: true,
				disabled: !activeRecord
			},
			{
				label: "Daten neu eingeben",
				value: false
			}
		],
		[activeRecord]
	);

	const { data: dayData } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Day",
			fields: [
				"objectId",
				"saldo",
				"time",
				"date",
				"default_time",
				"type",
				"absence{objectId state type year}"
			]
		}),
		{
			variables: {
				params: {
					user: { _eq: userId },
					year: { _eq: activeRecord?.year }
				}
			},
			skip: !activeRecord
		}
	);

	const renderHolidayField = useMemo(
		() =>
			holidayTemplateData && [
				{
					label: "Feiertage",
					name: "holiday_template",
					type: "select",
					value: adobt
						? activeRecord?.holiday_template?.objectId
						: undefined,
					select_options:
						holidayTemplateData?.objects.findTemplate.results.map(
							(template: HolidayTemplate) => ({
								value: template.objectId,
								label: template.name,
								...template
							})
						),
					dataType: "object",
					disabled: adobt
				}
			],
		[holidayTemplateData, adobt, activeRecord]
	);

	const renderFields = useMemo(
		() =>
			data &&
			holidayTemplateData && [
				{
					label: "Anfangssaldo in Stunden zu Beginn der Zeiterfassung (in Stunden)",
					name: "initial_saldo",
					type: "number",
					value: activeRecord?.initial_saldo || 0,
					dataType: "number",
					placeholder: "60",
					width: "72px",
					text_align: "right",
					disabled: adobt,
					required: true
				},
				{
					label: "Urlaub zu Beginn der Zeiterfassung (in Tagen)",
					name: "initial_vacation",
					type: "number",
					value: activeRecord?.initial_vacation || 0,
					dataType: "number",
					placeholder: "27",
					width: "48px",
					text_align: "right",
					disabled: adobt,
					required: true
				},
				{
					label: "Urlaubstage pro Jahr",
					name: "vacation",
					type: "number",
					value: timeSettings?.vacation || 27,
					dataType: "number",
					placeholder: "27",
					width: "48px",
					text_align: "right",
					options: {
						number_start_value: 0
					},
					disabled: adobt
				},
				{
					label: "Wochenstunden",
					name: "hours",
					type: "number",
					value: timeSettings?.hours || 40,
					dataType: "number",
					placeholder: "40",
					width: "48px",
					text_align: "right",
					options: {
						number_start_value: 0
					},
					disabled: adobt
				},
				{
					label: "Tage Pro Woche",
					name: "weekdays",
					type: "number",
					value: timeSettings?.weekdays || 5,
					dataType: "number",
					placeholder: "5",
					width: "48px",
					text_align: "right",
					options: {
						number_start_value: 0,
						number_end_value: 7
					},
					disabled: adobt
				},
				{
					label: "Pause",
					name: "pause",
					type: "number",
					value: timeSettings?.pause || 30,
					dataType: "number",
					placeholder: "30",
					width: "48px",
					text_align: "right",
					options: {
						number_start_value: 0
					},
					disabled: adobt
				},
				{
					label: "Standard-Startzeit",
					name: "start",
					type: "time",
					value: timeSettings?.start,
					dataType: "string",
					placeholder: "07:00",
					width: "48px",
					text_align: "right",
					disabled: adobt
				}
			],
		[data, holidayTemplateData, timeSettings, adobt]
	);

	const createRecordHandler = useCallback(async () => {
		if (
			nextRecord === null ||
			!nextRecord?.time_settings ||
			!nextRecord?.start_date ||
			!nextRecord?.end_date ||
			!nextRecord?.holiday_template
		) {
			return;
		}

		const holidays = holidayData?.objects.findHoliday.results;

		const holidayArray: string[] = [];

		holidays.forEach((holiday: Holiday) => {
			if (
				nextRecord?.holiday_template?.holidays?.includes(
					holiday.objectId
				)
			) {
				holidayArray.push(holiday.name);
			}
		});

		const holidayDates = getHolidayDates(year, holidays);

		const { default_times } = createInitialTimes({
			start_date: nextRecord?.start_date,
			end_date: nextRecord?.end_date,
			timeSettings: nextRecord?.time_settings,
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
				working_days: [],
				former_record:
					activeRecord && adobt
						? {
								__type: "Pointer",
								className: "Record",
								objectId: activeRecord.objectId
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
				}
			}
		});

		setDisabled([false, false]);
		setCreateRecord(false);
		refetch();
	}, [year, adobt, activeRecord, nextRecord, userId, projectId, holidayData]);

	useEffect(() => {
		if (activeRecord) {
			if (
				year !== activeRecord.year &&
				activeRecord.end_date !== `${activeRecord.year}-12-31`
			) {
				setActiveRecord({
					...activeRecord,
					end_date: `${activeRecord.year}-12-31`
				});
			}
			if (activeRecord?.year && activeRecord?.year + 1 === year) {
				setNextRecord((record) => ({
					...record,
					start_date: `${year}-01-01`
				}));
			} else if (activeRecord?.year + 1 === year) {
				const thisMonth = new Date().getMonth() + 1;
				setNextRecord((record) => ({
					...record,
					start_date: `${year}-${thisMonth.toString().padStart(2, "0")}-01`
				}));
			}
		}
	}, [year]);

	useEffect(() => {
		const errorArray: ErrorMessage[] = [];

		if (!adobt) {
			if (!nextRecord.holiday_template) {
				errorArray.push({
					message: "Bitte ein Feiertag-Template auswählen",
					key: "holiday_template",
					id: "holiday_template"
				});
			}
		}

		setErrors(errorArray);
	}, [adobt, nextRecord]);

	const SecondaryContent = useMemo(() => {
		if (!activeRecord) {
			return null;
		}
		return (
			<RecordSettings
				record={activeRecord}
				days={dayData?.objects.findDay.results}
			/>
		);
	}, [activeRecord, dayData]);

	if (loading) {
		return <p>Lädt...</p>;
	}

	return (
		<SlideIn
			isOpen={createRecord}
			cancel={() => setCreateRecord(false)}
			confirm={() => createRecordHandler()}
			confirmText="Zeiterfassung anlegen"
			header="Neuen Zeiterfassung anlegen"
			disabled={[disabled[0], disabled[1] || errors.length > 0]}
			errors={errors}
			secondaryContent={SecondaryContent}
		>
			<div className={styles.create_record_content}>
				<PersonDisplay person={person} />
				<div className={styles.create_record_switch_buttons}>
					<div>
						<h3>Jahr auswählen</h3>
						<Divider size="small" showLine={false} />
						<SwitchButtons
							buttonStates={buttonStates}
							changeHandler={(state: SwitchButton) =>
								setYear(state.value as number)
							}
							currentStates={
								buttonStates.find(
									(value) => value.value === year
								) as {
									value: number;
									label: string;
								}
							}
						/>
					</div>
					<div>
						<h3>
							Zeitangaben des bestehenden Eintrags übernehmen
							(Urlaube und Überstunden)
						</h3>
						<Divider size="small" showLine={false} />
						<SwitchButtons
							buttonStates={adobtButtonOptions}
							changeHandler={(state: SwitchButton) => {
								if (state.value === true && activeRecord) {
									setNextRecord({
										...nextRecord,
										time_settings:
											activeRecord.time_settings,
										holiday_template:
											activeRecord.holiday_template,
										former_record: activeRecord
									});
								}
								if (state.value === false) {
									setNextRecord({
										...nextRecord,
										time_settings: timeSettings,
										holiday_template: undefined,
										former_record: undefined
									});
								}
								setAdobt(state.value as boolean);
							}}
							currentStates={
								adobtButtonOptions.find(
									(value) => value.value === adobt
								) as {
									value: boolean;
									label: string;
								}
							}
						/>
						{/* <InfoBox text='Wenn diese Option aktiviert ist, werden die Urlaube und Überstunden des bestehenden Eintrags übernommen. Andernfalls werden die Urlaube und Überstunden auf 0 gesetzt oder können individuell eingetragen werden.' /> */}
					</div>
				</div>
				<div>
					<h3>Zeitdaten für neuen Record festlegen</h3>
				</div>
				<div className={styles.create_record_form_container}>
					{data ? (
						<>
							<Form
								fields={renderHolidayField || []}
								data={nextRecord}
								isHorizontal
								formSubmitHandler={(values) => {
									setNextRecord({
										...nextRecord,
										...(values as HolidayTemplate)
									});
								}}
								enableReinitialize
								useWithDebounce
							/>
							<Form
								fields={renderFields || []}
								data={timeSettings}
								isHorizontal
								formSubmitHandler={(values) => {
									setNextRecord({
										...nextRecord,
										time_settings: {
											...nextRecord.time_settings,
											...(values as RecordTimeSettings)
										}
									});
								}}
								useWithDebounce
							/>
						</>
					) : (
						<p>Lädt...</p>
					)}
				</div>
			</div>
		</SlideIn>
	);
};

export default CreateRecord;
