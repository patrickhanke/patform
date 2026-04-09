import { getCurrentRecord, getRemainingVacation } from "@repo/provider";
import { FC, useMemo } from "react";
import { StaffVacationProps } from "./types";

const StaffVacation: FC<StaffVacationProps> = ({
	month,
	year,
	records,
	days
}) => {
	const start = new Date(year, 0, 1).toISOString();
	const end = new Date(year, month.id + 1, 0).toISOString();
	const record = getCurrentRecord(records, end);

	const vacationData = useMemo(() => {
		if (!record) {
			return null;
		}
		const data = getRemainingVacation(start, end, record, days);
		return data;
	}, [record, start, end, days]);

	return (
		<div>
			<h3>Urlaub</h3>
			<div className="content_element">
				<div className="horizontal_container">
					<label className="surcharge_name">
						Urlaub Anfang des Jahres
					</label>
					<p>{vacationData?.initialVacation}</p>
				</div>
				<div className="horizontal_container">
					<label className="surcharge_name">
						Genommener Urlaub (bis Ende {month.label} {year}){" "}
					</label>
					<p>{vacationData?.takenVacation}</p>
				</div>
				<div className="horizontal_container">
					<label className="surcharge_name">
						Verbleibender Urlaub (bis Ende {year})
					</label>
					<p>
						{vacationData
							? vacationData.remainingVacation
							: "Fehler bei der Zeiterfassung"}
					</p>
				</div>
			</div>
		</div>
	);
};

export default StaffVacation;
