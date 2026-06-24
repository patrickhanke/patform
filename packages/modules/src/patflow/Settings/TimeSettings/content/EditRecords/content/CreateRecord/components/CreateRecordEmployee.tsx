import { FC, useMemo } from "react";
import { Divider, InfoBox, PersonDisplay } from "@repo/ui";
import { formatDate } from "../functions/dateHelpers";
import { isRecordEditable } from "../functions/recordFormState";
import { CreateRecordEmployeeProps } from "../types";
import styles from "../CreateRecord.module.scss";

const CreateRecordEmployee: FC<CreateRecordEmployeeProps> = ({
	person,
	records,
	currentYear,
	nextYearStartDate,
	nextYearRecord,
	onEditRecord
}) => {
	const sortedRecords = useMemo(
		() =>
			[...records].sort((a, b) =>
				b.start_date.localeCompare(a.start_date)
			),
		[records]
	);

	return (
		<div className={styles.step_content}>
			<Divider showLine={false} />
			<div className="horizontal_container">
				<label>Mitarbeiter</label>
				<PersonDisplay person={person} />
			</div>

			<div className={styles.existing_records_section}>
				<h4>Bestehende Zeiterfassungen</h4>
				{sortedRecords.length === 0 ? (
					<p className={styles.step_description}>
						Für diesen Mitarbeiter existiert noch keine
						Zeiterfassung.
					</p>
				) : (
					<div className={styles.existing_records_list}>
						{sortedRecords.map((record) => {
							const canEdit = isRecordEditable(
								record,
								currentYear
							);

							return (
								<div
									key={record.objectId}
									className={styles.existing_record_row}
								>
									<div>
										<span className="label">Zeitraum</span>
										<p>
											{formatDate(record.start_date)} –{" "}
											{formatDate(record.end_date)}
										</p>
									</div>
									{canEdit ? (
										<button
											type="button"
											className="full_button sm secondary"
											onClick={() =>
												onEditRecord(record)
											}
										>
											Bearbeiten
										</button>
									) : (
										<span
											className={
												styles.record_not_editable
											}
										>
											Nicht bearbeitbar
										</span>
									)}
								</div>
							);
						})}
					</div>
				)}
			</div>

			{nextYearRecord ? (
				<InfoBox
					text={`Für ${formatDate(nextYearStartDate)} existiert bereits eine Zeiterfassung. Eine neue Zeiterfassung zu diesem Startdatum ist nicht möglich – bitte die bestehende Zeiterfassung bearbeiten.`}
				/>
			) : (
				<InfoBox text="Für diesen Mitarbeiter wird eine neue Zeiterfassung angelegt. Klicke auf Weiter, um fortzufahren." />
			)}
		</div>
	);
};

export default CreateRecordEmployee;
