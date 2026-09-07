import { FC, useMemo } from "react";
import { Divider, Modal } from "@repo/ui";
import { convertMillisecondsToString, getWeekdaySaldo } from "@repo/provider";
import generateId from "../functions/generateId";
import { CreateRecordWeekdayProps } from "../types";
import styles from "../CreateRecord.module.scss";

const CreateRecordWeekday: FC<CreateRecordWeekdayProps> = ({
	setting,
	label,
	isOpen,
	onClose,
	onChange
}) => {
	const saldo = useMemo(() => getWeekdaySaldo(setting), [setting]);

	const updateTime = (key: "start" | "end", value: string) => {
		onChange({ ...setting, [key]: value });
	};

	const addBreak = () => {
		onChange({
			...setting,
			breaks: [
				...setting.breaks,
				{ start: "12:00", end: "12:30", id: generateId() }
			]
		});
	};

	const updateBreak = (id: string, key: "start" | "end", value: string) => {
		onChange({
			...setting,
			breaks: setting.breaks.map((breakItem) =>
				breakItem.id === id ? { ...breakItem, [key]: value } : breakItem
			)
		});
	};

	const removeBreak = (id: string) => {
		onChange({
			...setting,
			breaks: setting.breaks.filter((breakItem) => breakItem.id !== id)
		});
	};

	return (
		<Modal
			isOpen={isOpen}
			header={`${label} bearbeiten`}
			cancelButtonHandler={onClose}
			confirmButtonHandler={onClose}
			confirmButtonText="Übernehmen"
		>
			<div className={styles.step_content}>
				<div className={styles.weekday_times}>
					<div className={styles.break_field}>
						<label htmlFor="weekday_start">Start</label>
						<input
							id="weekday_start"
							type="time"
							value={setting.start}
							onChange={(event) =>
								updateTime("start", event.target.value)
							}
							className={styles.time_input}
						/>
					</div>
					<div className={styles.break_field}>
						<label htmlFor="weekday_end">Ende</label>
						<input
							id="weekday_end"
							type="time"
							value={setting.end}
							onChange={(event) =>
								updateTime("end", event.target.value)
							}
							className={styles.time_input}
						/>
					</div>
				</div>
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
					{setting.breaks.length === 0 && (
						<p className={styles.breaks_empty}>
							Keine Pausen definiert
						</p>
					)}
					{setting.breaks.map((breakItem) => (
						<div key={breakItem.id} className={styles.break_item}>
							<div className={styles.break_field}>
								<label>Von</label>
								<input
									type="time"
									value={breakItem.start}
									onChange={(event) =>
										updateBreak(
											breakItem.id,
											"start",
											event.target.value
										)
									}
									className={styles.time_input}
								/>
							</div>
							<div className={styles.break_field}>
								<label>Bis</label>
								<input
									type="time"
									value={breakItem.end}
									onChange={(event) =>
										updateBreak(
											breakItem.id,
											"end",
											event.target.value
										)
									}
									className={styles.time_input}
								/>
							</div>
							<button
								type="button"
								className="sm danger"
								onClick={() => removeBreak(breakItem.id)}
							>
								Entfernen
							</button>
						</div>
					))}
				</div>
				<Divider showLine />
				<div className={styles.record_info_row}>
					<span className="label">Index</span>
					<span>{setting.index}</span>
				</div>
				<div className={styles.record_info_row}>
					<span className="label">Saldo</span>
					<span>{convertMillisecondsToString(saldo)} Std.</span>
				</div>
			</div>
		</Modal>
	);
};

export default CreateRecordWeekday;
