import React, { useMemo, useState } from "react";
import { EditRecordProps } from "./types";
import { Divider, IconButton, SlideIn } from "@repo/ui";
import {
	convertMillisecondsToString,
	getDateString,
	normalizeTimeSettings,
	weekdays
} from "@repo/provider";
import { RecordTimeSettings } from "@repo/types";

const Editrecord: React.FC<EditRecordProps> = ({ record }) => {
	const [editRecord, setEditRecord] = useState<boolean>(false);

	const timeSettings: RecordTimeSettings = useMemo(
		() => normalizeTimeSettings(record.time_settings),
		[record.time_settings]
	);

	const getTimeSettingLabel = (key: string) => {
		switch (key) {
			case "hours":
				return "Arbeitszeit";
			case "vacation":
				return "Urlaubstage";
			case "pause":
				return "Pause";
			case "weekdays":
				return "Wochenstunden";
			case "start":
				return "Start";
			case "end":
				return "Ende";
			case "initial_saldo":
				return "Anfangssaldo";
			case "initial_vacation":
				return "Anfangsurlaub";
			default:
				return key;
		}
	};
	return (
		<div>
			<IconButton
				onClick={() => setEditRecord(true)}
				icon="view"
				disabled={record.year < new Date().getFullYear()}
			/>
			<SlideIn
				isOpen={editRecord}
				cancel={() => setEditRecord(false)}
				confirm={() => setEditRecord(false)}
				header={`Zeiterfassung ${record.year} bearbeiten`}
			>
				<div>
					<Divider />
					<div className="horizontal_container">
						<label htmlFor="start_date">Startdatum</label>
						<p>
							{
								getDateString(new Date(record.start_date))
									.dateTime
							}
						</p>
					</div>
					<Divider showLine={false} />
					<div className="horizontal_container">
						<label htmlFor="end_date">Enddatum</label>
						<p>
							{getDateString(new Date(record.end_date)).dateTime}
						</p>
					</div>
				</div>
				<Divider showLine />
				<div>
					<h3>Zeiteinstellungen</h3>
					<Divider showLine={false} />
					<div className="horizontal_container">
						<label>{getTimeSettingLabel("hours")}</label>
						<p>{timeSettings.hours} Std. / Woche</p>
					</div>
					<Divider showLine={false} />
					<div className="horizontal_container">
						<label>{getTimeSettingLabel("vacation")}</label>
						<p>{timeSettings.vacation} Tage</p>
					</div>
					<Divider showLine />
					{timeSettings.weekdays.map((setting) => (
						<div
							key={setting.index}
							className="horizontal_container"
						>
							<label>
								{
									weekdays.find(
										(weekday) =>
											weekday.index === setting.index
									)?.label
								}
							</label>
							{setting.saldo > 0 ? (
								<p>
									{setting.start} – {setting.end}
									{setting.breaks.length > 0 &&
										` (${getTimeSettingLabel("pause")} ${setting.breaks
											.map(
												(breakItem) =>
													`${breakItem.start} – ${breakItem.end}`
											)
											.join(", ")})`}{" "}
									·{" "}
									{convertMillisecondsToString(setting.saldo)}{" "}
									Std.
								</p>
							) : (
								<p>Kein Arbeitstag</p>
							)}
						</div>
					))}
				</div>
			</SlideIn>
		</div>
	);
};

export default Editrecord;
