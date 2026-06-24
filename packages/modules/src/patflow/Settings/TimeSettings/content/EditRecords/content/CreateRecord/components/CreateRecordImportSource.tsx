import { FC } from "react";
import { Divider, InfoBox } from "@repo/ui";
import { formatDate } from "../functions/dateHelpers";
import { CreateRecordImportSourceProps } from "../types";
import styles from "../CreateRecord.module.scss";

const CreateRecordImportSource: FC<CreateRecordImportSourceProps> = ({
	importMode,
	latestRecord,
	onSelect,
	isEditing = false
}) => (
	<div className={styles.step_content}>
		<h3>Datenquelle wählen</h3>
		<Divider showLine={false} />
		{isEditing ? (
			<>
				<p className={styles.step_description}>
					Die Datenquelle kann bei einer bestehenden Zeiterfassung
					nicht geändert werden.
				</p>
				<div className={styles.record_info_row}>
					<span className="label">Datenquelle</span>
					<span>
						{importMode === "import"
							? "Aus bestehendem Record übernommen"
							: "Neue Daten eingegeben"}
					</span>
				</div>
			</>
		) : (
			<>
				<div className={styles.import_buttons}>
					<button
						type="button"
						className={[
							"full_button",
							importMode === "new" ? "primary" : "secondary",
							"sm"
						].join(" ")}
						onClick={() => onSelect("new")}
					>
						Neue Daten eingeben
					</button>
					<button
						type="button"
						className={[
							"full_button",
							importMode === "import" ? "primary" : "secondary",
							"sm",
							!latestRecord ? "disabled" : ""
						].join(" ")}
						onClick={() => latestRecord && onSelect("import")}
						disabled={!latestRecord}
					>
						Aus bestehendem Record übernehmen
					</button>
				</div>
				{!latestRecord && (
					<InfoBox text="Kein bestehender Record für diesen Mitarbeiter gefunden. Bitte neue Daten eingeben." />
				)}
				{importMode === "import" && latestRecord && (
					<div className={styles.import_record_info}>
						<h4>Übernommene Daten aus:</h4>
						<div className={styles.record_info_row}>
							<span className="label">Zeitraum</span>
							<span>
								{formatDate(latestRecord.start_date)} –{" "}
								{formatDate(latestRecord.end_date)}
							</span>
						</div>
						<div className={styles.record_info_row}>
							<span className="label">Wochenstunden</span>
							<span>{latestRecord.time_settings?.hours} Std.</span>
						</div>
						<div className={styles.record_info_row}>
							<span className="label">Urlaubstage</span>
							<span>
								{latestRecord.time_settings?.vacation} Tage
							</span>
						</div>
						<div className={styles.record_info_row}>
							<span className="label">Feiertag-Template</span>
							<span>
								{latestRecord.holiday_template?.name ?? "–"}
							</span>
						</div>
					</div>
				)}
			</>
		)}
	</div>
);

export default CreateRecordImportSource;
