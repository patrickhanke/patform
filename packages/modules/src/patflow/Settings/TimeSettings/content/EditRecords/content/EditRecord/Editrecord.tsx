import React, { useState } from "react";
import { EditRecordProps } from "./types";
import { Divider, IconButton, SlideIn } from "@repo/ui";
import { getDateString } from "@repo/provider";
import { RecordTimeSettings } from "@repo/types";

const Editrecord: React.FC<EditRecordProps> = ({ record }) => {
	const [editRecord, setEditRecord] = useState<boolean>(false);
	console.log({ record });

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
				{Object.keys(record.time_settings).map((key) => (
					<div key={key} className="horizontal_container">
						<label htmlFor={key}>{getTimeSettingLabel(key)}</label>
						<p>
							{
								record.time_settings[
									key as keyof RecordTimeSettings
								]
							}
						</p>
					</div>
				))}
			</SlideIn>
		</div>
	);
};

export default Editrecord;
