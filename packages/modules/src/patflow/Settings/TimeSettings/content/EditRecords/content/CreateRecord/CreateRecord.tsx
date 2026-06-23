import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { CreateRecordProps } from "./types";
import { useFindData } from "@repo/provider";
import {
	ErrorMessage,
	Holiday,
	HolidayTemplate,
	Record,
	RecordTimeSettings
} from "@repo/types";
import styles from "./CreateRecord.module.scss";
import { createInitialTimes, getHolidayDates } from "@repo/provider";
import { useDataHandler } from "@repo/provider";
import RecordSettings from "./components/RecordSettings";
import defaultRecord from "./constants/defaultRecord";
import { cloneDeep } from "lodash-es";
import {
	Divider,
	Form,
	PersonDisplay,
	SlideIn,
	SwitchButtons,
	SwitchButton,
	Modal
} from "@repo/ui";
import RecordSurcharges from "./components/RecordSurcharges";
import RecordTimes from "./components/RecordTimes";

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
	const [year, setYear] = useState<number>(new Date().getFullYear());
	const [adobt, setAdobt] = useState(false);
	const [activeRecord, setActiveRecord] = useState<Record | null>(null);
	const [nextRecord, setNextRecord] = useState<Partial<Record>>(
		defaultRecord(year)
	);

	console.log({ year });
	const [errors, setErrors] = useState<ErrorMessage[]>([]);
	const [editSurcharges, setEditSurcharges] = useState(false);
	const [surcharges, setSurcharges] = useState<string[]>([]);
	const { data, loading } = useFindData({
		objectName: "Record",
		fields: [
			"objectId",
			"year",
			"user {objectId first_name last_name}",
			"default_times",
			"createdAt"
		],
		filters: [{ key: "year", value: year, operator: "equalTo" }],
		userId: userId
	});

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
				disabled: data?.some((record: Record) => record.year === year)
			});
		}

		return stateArray;
	}, [data]);

	console.log({ buttonStates });

	

	const { data: dayData } = useFindData({
		objectName: "Day",
		fields: [
			"objectId",
			"saldo",
			"time",
			"date",
			"default_time",
			"type",
			"absence {objectId state type year}"
		],
		filters: [
			{
				key: "year",
				value: activeRecord?.year as number,
				operator: "equalTo"
			}
		],
		skipQuery: !activeRecord,
		userId: userId
	});

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
					select_options: holidayTemplateData?.map(
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

	const secondaryContent = useMemo(() => {
		return (
			<RecordTimes
				activeRecord={activeRecord}
				setNextRecord={setNextRecord}
				nextRecord={nextRecord}
				setAdobt={setAdobt}
				adobt={adobt}
			/>
		);
	}, [activeRecord, nextRecord]);

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

		const holidays = holidayData;

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
				},
				surcharges: surcharges
			}
		});

		setDisabled([false, false]);
		setCreateRecord(false);
		refetch();
	}, [
		year,
		adobt,
		activeRecord,
		nextRecord,
		userId,
		projectId,
		holidayData,
		surcharges
	]);

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

	if (loading) {
		return <p>Lädt...</p>;
	}

	console.log({ surcharges });
	console.log({ nextRecord });

	return (
		<>
			<SlideIn
				isOpen={createRecord}
				cancel={() => setCreateRecord(false)}
				confirm={() => createRecordHandler()}
				confirmText="Zeiterfassung anlegen"
				header="Neuen Zeiterfassung anlegen"
				disabled={[disabled[0], disabled[1] || errors.length > 0]}
				errors={errors}
				secondaryContent={secondaryContent}
				showSecondaryContent
				preventClickOutside
			>
				<div className={styles.create_record_content}>
					<div className="horizontal_container">
						<label>Mitarbeiter</label>
						<PersonDisplay person={person} />
					</div>
					<div className={styles.create_record_switch_buttons}>
						<div className="horizontal_container">
							<h3>Beginn</h3>
							<SwitchButtons
								buttonStates={[
									{
										value: "this_year",
										label: "Dieses Jahr"
									},
									{
										value: "next_year",
										label: "Nächstes Jahr"
									}
								]}
								changeHandler={(state: SwitchButton) => {
									if (state.value === "this_year") {
										setYear(new Date().getFullYear());
									} else {
										setYear(new Date().getFullYear() + 1);
									}
								}}
								currentStates={
									year === new Date().getFullYear()
										? {
												value: "this_year",
												label: "Dieses Jahr"
											}
										: {
												value: "next_year",
												label: "Nächstes Jahr"
											}
								}
							/>
						</div>
						<div>
							
							{/* <InfoBox text='Wenn diese Option aktiviert ist, werden die Urlaube und Überstunden des bestehenden Eintrags übernommen. Andernfalls werden die Urlaube und Überstunden auf 0 gesetzt oder können individuell eingetragen werden.' /> */}
						</div>
					</div>
					
					<div className={styles.create_record_form_container}>
						{data ? (
							<>
								<Form
									fields={renderHolidayField}
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
							</>
						) : (
							<p>Lädt...</p>
						)}
					</div>
					<button
						className="full_button primary sm"
						onClick={() => setEditSurcharges(true)}
					>
						{surcharges.length > 0
							? "Zuschläge bearbeiten"
							: "Zuschläge hinzufügen"}
					</button>
				</div>
			</SlideIn>
			<Modal
				isOpen={editSurcharges}
				cancelButtonHandler={() => setEditSurcharges(false)}
				header="Zuschläge bearbeiten"
			>
				<RecordSurcharges
					surcharges={nextRecord.surcharges || []}
					setSurcharges={setSurcharges}
				/>
			</Modal>
		</>
	);
};

export default CreateRecord;
