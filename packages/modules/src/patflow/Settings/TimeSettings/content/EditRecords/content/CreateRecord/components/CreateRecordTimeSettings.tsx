import { FC, useCallback, useMemo } from "react";
import { Record, RecordTimeSettings } from "@repo/types";
import type { Field } from "@repo/ui";
import { Divider, Form } from "@repo/ui";
import generateId from "../functions/generateId";
import { CreateRecordTimeSettingsProps } from "../types";
import styles from "../CreateRecord.module.scss";

const CreateRecordTimeSettings: FC<CreateRecordTimeSettingsProps> = ({
	nextRecord,
	setNextRecord,
	breaks,
	setBreaks,
	isEditing = false
}) => {
	const extNextRecord = nextRecord as Record & {
		initial_saldo?: number;
		initial_vacation?: number;
	};

	const timeSettingsFields = useMemo(
		(): Field[] =>
			[
				{
					id: "",
					label: "Wochenstunden",
					name: "hours",
					type: "number" as const,
					value: nextRecord.time_settings?.hours ?? 40,
					dataType: "number" as const,
					placeholder: "40",
					width: "60px",
					options: { number_start_value: 0, number_end_value: 999 },
					disabled: isEditing
				},
				{
					id: "",
					label: "Tage pro Woche",
					name: "weekdays",
					type: "number" as const,
					value: nextRecord.time_settings?.weekdays ?? 5,
					dataType: "number" as const,
					placeholder: "5",
					width: "60px",
					options: { number_start_value: 0, number_end_value: 7 },
					disabled: isEditing
				},
				{
					id: "",
					label: "Urlaubstage pro Jahr",
					name: "vacation",
					type: "number" as const,
					value: nextRecord.time_settings?.vacation ?? 30,
					dataType: "number" as const,
					placeholder: "30",
					width: "60px",
					options: { number_start_value: 0, number_end_value: 365 }
				},
				{
					id: "",
					label: "Standard-Startzeit",
					name: "start",
					type: "time" as unknown as "input",
					value: nextRecord.time_settings?.start ?? "08:00",
					dataType: "string" as const,
					placeholder: "08:00",
					width: "80px"
				}
			] as unknown as Field[],
		[nextRecord.time_settings, isEditing]
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

	const syncBreaksToRecord = useCallback(
		(updated: { start: string; end: string; id: string }[]) => {
			setBreaks(updated);
			setNextRecord((prev) => ({
				...prev,
				time_settings: {
					...prev.time_settings!,
					breaks: updated
				}
			}));
		},
		[setBreaks, setNextRecord]
	);

	const addBreak = () => {
		syncBreaksToRecord([
			...breaks,
			{ start: "12:00", end: "12:30", id: generateId() }
		]);
	};

	const updateBreak = (
		id: string,
		field: "start" | "end",
		value: string
	) => {
		syncBreaksToRecord(
			breaks.map((b) => (b.id === id ? { ...b, [field]: value } : b))
		);
	};

	const removeBreak = (id: string) => {
		syncBreaksToRecord(breaks.filter((b) => b.id !== id));
	};

	return (
		<div className={styles.step_content}>
			<h3>Zeiteinstellungen</h3>
			<Divider showLine={false} />
			<Form
				fields={timeSettingsFields}
				data={nextRecord.time_settings}
				isHorizontal
				formSubmitHandler={(values) => {
					setNextRecord((prev) => ({
						...prev,
						time_settings: {
							...prev.time_settings!,
							...(values as Partial<RecordTimeSettings>)
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
			<Divider showLine />
			<div className={styles.breaks_section}>
				<div className={styles.breaks_header}>
					<h4>Pausen</h4>
					<button
						type="button"
						className="sm primary"
						onClick={addBreak}
					>
						+ Pause hinzufügen
					</button>
				</div>
				{breaks.length === 0 && (
					<p className={styles.breaks_empty}>
						Keine Pausen definiert
					</p>
				)}
				{breaks.map((b) => (
					<div key={b.id} className={styles.break_item}>
						<div className={styles.break_field}>
							<label>Von</label>
							<input
								type="time"
								value={b.start}
								onChange={(e) =>
									updateBreak(b.id, "start", e.target.value)
								}
								className={styles.time_input}
							/>
						</div>
						<div className={styles.break_field}>
							<label>Bis</label>
							<input
								type="time"
								value={b.end}
								onChange={(e) =>
									updateBreak(b.id, "end", e.target.value)
								}
								className={styles.time_input}
							/>
						</div>
						<button
							type="button"
							className="sm danger"
							onClick={() => removeBreak(b.id)}
						>
							Entfernen
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default CreateRecordTimeSettings;
