import React, { FC, useMemo } from "react";
import { Form, SwitchButton, SwitchButtons } from "@repo/ui";
import { RecordTimesProps } from "../types";
import { RecordTimeSettings } from "@repo/types";

const RecordTimes: FC<RecordTimesProps> = ({
	activeRecord,
	adobt = false,
	setAdobt,
	setNextRecord,
	nextRecord
}) => {
	const adobtButtonOptions: { label: string; value: boolean }[] = useMemo(
		() => [
			{
				label: "Eintrag übernehmen",
				value: true
			},
			{
				label: "Daten neu eingeben",
				value: false
			}
		],
		[activeRecord]
	);

	const renderFields = useMemo(
		() => [
			{
				id: "",
				label: "Anfangssaldo in Stunden zu Beginn der Zeiterfassung (in Stunden)",
				name: "initial_saldo",
				type: "number",
				value: 0,
				dataType: "number",
				placeholder: "60",
				width: "72px",
				text_align: "right",
				disabled: () => adobt,
				required: true
			},
			{
				id: "",
				label: "Urlaub zu Beginn der Zeiterfassung (in Tagen)",
				name: "initial_vacation",
				type: "number",
				value: 0,
				dataType: "number",
				placeholder: "27",
				width: "48px",
				text_align: "right",
				disabled: () => adobt,
				required: true
			},
			{
				id: "",
				label: "Urlaubstage pro Jahr",
				name: "vacation",
				type: "number",
				value: activeRecord?.time_settings?.vacation || 27,
				dataType: "number",
				placeholder: "27",
				width: "48px",
				text_align: "right",
				options: {
					number_start_value: 0
				},
				disabled: () => adobt
			},
			{
				id: "",
				label: "Wochenstunden",
				name: "hours",
				type: "number",
				value: activeRecord?.time_settings?.hours || 40,
				dataType: "number",
				placeholder: "40",
				width: "48px",
				text_align: "right",
				options: {
					number_start_value: 0
				},
				disabled: () => adobt
			},
			{
				id: "",
				label: "Tage Pro Woche",
				name: "weekdays",
				type: "number",
				value: activeRecord?.time_settings?.weekdays || 5,
				dataType: "number",
				placeholder: "5",
				width: "48px",
				text_align: "right",
				options: {
					number_start_value: 0,
					number_end_value: 7
				},
				disabled: () => adobt
			},
			{
				id: "",
				label: "Pause",
				name: "pause",
				type: "number",
				value: activeRecord?.time_settings?.pause || 30,
				dataType: "number",
				placeholder: "30",
				width: "48px",
				text_align: "right",
				options: {
					number_start_value: 0
				},
				disabled: () => adobt
			},
			{
				id: "",
				label: "Standard-Startzeit",
				name: "start",
				type: "time",
				value: activeRecord?.time_settings?.start,
				dataType: "string",
				placeholder: "07:00",
				width: "48px",
				text_align: "right",
				disabled: () => adobt
			}
		],
		[activeRecord, adobt]
	);

	return (
		<div>
			<div>
				<h3>Zeitdaten für neuen Record festlegen</h3>
			</div>
			<SwitchButtons
				buttonStates={adobtButtonOptions}
				changeHandler={(state: SwitchButton) => {
					if (state.value === true && activeRecord) {
						setNextRecord({
							...nextRecord,
							time_settings: activeRecord.time_settings,
							holiday_template: activeRecord.holiday_template,
							former_record: activeRecord
						});
					}
					if (state.value === false) {
						setNextRecord({
							...nextRecord,
							time_settings: activeRecord?.time_settings,
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

			<Form
				fields={renderFields || []}
				data={activeRecord?.time_settings}
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
		</div>
	);
};

export default RecordTimes;
