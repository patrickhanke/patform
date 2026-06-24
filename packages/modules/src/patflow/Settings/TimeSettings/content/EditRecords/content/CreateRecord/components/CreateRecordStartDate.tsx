import { FC, useMemo } from "react";
import { Divider, InfoBox } from "@repo/ui";
import { MONTH_NAMES } from "../constants/steps";
import { formatDate, oneDayBefore } from "../functions/dateHelpers";
import { CreateRecordStartDateProps } from "../types";
import styles from "../CreateRecord.module.scss";

const CreateRecordStartDate: FC<CreateRecordStartDateProps> = ({
	currentYear,
	startDate,
	existingStartDates,
	conflictingRecord,
	onSelect,
	isEditing = false,
	nextYearStartDate,
	nextYearRecord,
	onEditRecord
}) => {
	const availableStartDates = useMemo(() => {
		const dates: { value: string; label: string }[] = [];
		for (let month = 0; month < 12; month++) {
			const value = `${currentYear}-${String(month + 1).padStart(2, "0")}-01`;
			dates.push({
				value,
				label: `1. ${MONTH_NAMES[month]} ${currentYear}`
			});
		}
		dates.push({
			value: nextYearStartDate,
			label: `1. Januar ${currentYear + 1}`
		});
		return dates;
	}, [currentYear, nextYearStartDate]);

	return (
		<div className={styles.step_content}>
			<h3>Startdatum auswählen</h3>
			<Divider showLine={false} />
			{isEditing ? (
				<>
					<p className={styles.step_description}>
						Das Startdatum kann bei einer bestehenden Zeiterfassung
						nicht geändert werden.
					</p>
					<div className={styles.record_info_row}>
						<span className="label">Startdatum</span>
						<span>{formatDate(startDate)}</span>
					</div>
				</>
			) : (
				<>
					<p className={styles.step_description}>
						Wähle den Beginn der neuen Zeiterfassung. Nur der erste
						eines Monats ist möglich.
					</p>
					<div className={styles.date_grid}>
						{availableStartDates.map((d) => {
							const isSelected = startDate === d.value;
							const isExisting = existingStartDates.has(d.value);
							const isNextYearBlocked =
								d.value === nextYearStartDate &&
								!!nextYearRecord;
							const isDisabled = isExisting || isNextYearBlocked;

							return (
								<button
									key={d.value}
									type="button"
									className={[
										styles.date_button,
										isSelected
											? styles.date_button_selected
											: "",
										isDisabled
											? styles.date_button_disabled
											: ""
									].join(" ")}
									onClick={() =>
										!isDisabled && onSelect(d.value)
									}
									disabled={isDisabled}
								>
									{d.label}
								</button>
							);
						})}
					</div>
					{nextYearRecord && (
						<>
							<InfoBox
								text={`Für ${formatDate(nextYearStartDate)} existiert bereits eine Zeiterfassung.`}
							/>
							<button
								type="button"
								className="full_button sm secondary"
								onClick={() => onEditRecord(nextYearRecord)}
							>
								Zeiterfassung bearbeiten
							</button>
						</>
					)}
					{conflictingRecord && startDate && (
						<InfoBox
							text={`Achtung: Der bestehende Record (${formatDate(conflictingRecord.start_date)} – ${formatDate(conflictingRecord.end_date)}) wird automatisch auf ${formatDate(oneDayBefore(startDate))} verkürzt.`}
						/>
					)}
				</>
			)}
		</div>
	);
};

export default CreateRecordStartDate;
