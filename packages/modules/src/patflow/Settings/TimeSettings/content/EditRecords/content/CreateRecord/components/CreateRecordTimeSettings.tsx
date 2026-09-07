import { FC, useCallback, useMemo, useState } from "react";
import { Record, RecordWeekdaySetting } from "@repo/types";
import type { Field } from "@repo/ui";
import { Divider, Form } from "@repo/ui";
import {
	convertMillisecondsToString,
	getWeekdaySaldo,
	getWeeklyHours,
	getWorkingDaysPerWeek,
	normalizeTimeSettings,
	weekdays,
	withWeekdaySaldo
} from "@repo/provider";
import CreateRecordWeekday from "./CreateRecordWeekday";
import { CreateRecordTimeSettingsProps } from "../types";
import styles from "../CreateRecord.module.scss";

const CreateRecordTimeSettings: FC<CreateRecordTimeSettingsProps> = ({
	nextRecord,
	setNextRecord
}) => {
	const [editIndex, setEditIndex] = useState<number | null>(null);

	const extNextRecord = nextRecord as Record & {
		initial_saldo?: number;
		initial_vacation?: number;
	};

	const timeSettings = useMemo(
		() => normalizeTimeSettings(nextRecord.time_settings),
		[nextRecord.time_settings]
	);

	const weekdaySettings = timeSettings.weekdays;

	const editSetting = useMemo(
		() =>
			weekdaySettings.find((setting) => setting.index === editIndex) ??
			null,
		[weekdaySettings, editIndex]
	);

	const updateWeekday = useCallback(
		(updated: RecordWeekdaySetting) => {
			setNextRecord((prev) => {
				const settings = normalizeTimeSettings(prev.time_settings);
				const nextWeekdays = settings.weekdays.map((setting) =>
					setting.index === updated.index
						? withWeekdaySaldo(updated)
						: setting
				);

				return {
					...prev,
					time_settings: {
						...settings,
						weekdays: nextWeekdays,
						hours: getWeeklyHours(nextWeekdays)
					}
				};
			});
		},
		[setNextRecord]
	);

	const vacationFields = useMemo(
		(): Field[] =>
			[
				{
					id: "",
					label: "Urlaubstage pro Jahr",
					name: "vacation",
					type: "number" as const,
					value: timeSettings.vacation,
					dataType: "number" as const,
					placeholder: "30",
					width: "60px",
					options: { number_start_value: 0, number_end_value: 365 }
				}
			] as unknown as Field[],
		[timeSettings.vacation]
	);

	const initialValueFields = useMemo(
		(): Field[] =>
			[
				{
					id: "",
					label: "Anfangssaldo (in Stunden)",
					name: "initial_saldo",
					type: "number" as const,
					value: extNextRecord.initial_saldo ?? 0,
					dataType: "number" as const,
					placeholder: "0",
					width: "60px",
					options: { number_start_value: 0, number_end_value: 9999 }
				},
				{
					id: "",
					label: "Anfangsurlaub (in Tagen)",
					name: "initial_vacation",
					type: "number" as const,
					value: extNextRecord.initial_vacation ?? 0,
					dataType: "number" as const,
					placeholder: "0",
					width: "60px",
					options: { number_start_value: 0, number_end_value: 365 }
				}
			] as unknown as Field[],
		[extNextRecord.initial_saldo, extNextRecord.initial_vacation]
	);

	return (
		<div className={styles.step_content}>
			<h3>Zeiteinstellungen</h3>
			<Divider showLine={false} />
			<div className={styles.weekdays_section}>
				<div className={styles.breaks_header}>
					<h4>Wochentage</h4>
					<span className={styles.step_description}>
						{getWeeklyHours(weekdaySettings)} Std. /{" "}
						{getWorkingDaysPerWeek(weekdaySettings)} Tage pro Woche
					</span>
				</div>
				<div className={styles.weekday_grid}>
					{weekdays.map((weekday) => {
						const setting = weekdaySettings.find(
							(entry) => entry.index === weekday.index
						);
						const saldo = getWeekdaySaldo(setting);

						return (
							<button
								key={weekday.value}
								type="button"
								className={styles.weekday_button}
								onClick={() => setEditIndex(weekday.index)}
							>
								<span className={styles.weekday_button_label}>
									{weekday.label}
								</span>
								<span className={styles.weekday_button_times}>
									{saldo > 0
										? `${setting?.start} – ${setting?.end}`
										: "Kein Arbeitstag"}
								</span>
								<span className={styles.weekday_button_saldo}>
									{convertMillisecondsToString(saldo)} Std.
								</span>
							</button>
						);
					})}
				</div>
			</div>
			<Divider showLine />
			<Form
				fields={vacationFields}
				data={timeSettings}
				isHorizontal
				formSubmitHandler={(values) => {
					setNextRecord((prev) => ({
						...prev,
						time_settings: {
							...normalizeTimeSettings(prev.time_settings),
							vacation: (values as { vacation: number }).vacation
						}
					}));
				}}
				useWithDebounce
			/>
			<Divider showLine />
			<Form
				fields={initialValueFields}
				data={{
					initial_saldo: extNextRecord.initial_saldo ?? 0,
					initial_vacation: extNextRecord.initial_vacation ?? 0
				}}
				isHorizontal
				formSubmitHandler={(values) => {
					setNextRecord((prev) => ({
						...prev,
						...values
					}));
				}}
				useWithDebounce
			/>
			{editSetting && (
				<CreateRecordWeekday
					setting={editSetting}
					label={
						weekdays.find(
							(weekday) => weekday.index === editSetting.index
						)?.label ?? ""
					}
					isOpen={editIndex !== null}
					onClose={() => setEditIndex(null)}
					onChange={updateWeekday}
				/>
			)}
		</div>
	);
};

export default CreateRecordTimeSettings;
