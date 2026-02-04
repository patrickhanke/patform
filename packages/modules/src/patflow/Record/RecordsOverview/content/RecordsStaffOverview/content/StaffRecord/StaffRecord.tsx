import { useMemo, useState } from "react";
import { MonthData, StaffRecordProps } from "./types";
import {
	convertMillisecondsToString,
	createDateIntervalForMonth,
	findDefaultTimeForDate,
	months,
	useFindData
} from "@repo/provider";
import { Day } from "@repo/types";
import useTableColumns from "./hooks/useTableColumns";
import { SelectElement, SlideIn, Table } from "@repo/ui";
import SelectStaff from "./components/SelectStaff";

const StaffRecord = ({ days, year, staff }: StaffRecordProps) => {
	const [selectedWorker, setSelectedWorker] = useState<SelectElement[]>([]);
	const { data: recordData } = useFindData({
		objectName: "Record",
		fields: ["objectId", "year", "user {objectId}", "default_times", "createdAt"],
		filters: [
			{ key: "year", value: year, operator: "_eq" },
			{ key: "user", value: selectedWorker[0]?.objectId, operator: "_eq" }
		],
		skipQuery: !year || selectedWorker.length === 0
	});
	const [displayStaffRecord, setDisplayStaffRecord] = useState(false);
	const columns = useTableColumns();

	const monthData = useMemo(() => {
		const dataArray: MonthData[] = [];
		let totalSaldo = 0;
		let totalTarget = 0;
		let totalTimes = 0;
		if (!days && !recordData) {
			return dataArray;
		}

		months.forEach((month) => {
			const dateInterval = createDateIntervalForMonth(year, month.id);
			let target = 0;
			let monthTimes = 0;
			const record_default_times = dateInterval.map((dateElement) =>
				findDefaultTimeForDate(
					dateElement,
					recordData || []
				)
			);
			record_default_times.forEach((element) => {
				let default_time = 0;
				if (element.default_time?.type === "regular") {
					default_time =
						element.default_time?.duration -
						element.default_time?.pause;
				}
				target += default_time;
			});
			if (days && recordData) {
				dateInterval.forEach((dayString) => {
					const dayArray = days.filter(
						(dayToFind: Day) => dayToFind.date === dayString
					);

					if (dayArray.length > 1) {
						dayArray.forEach((day: Day) => {
							if (day && day.type === "work") {
								const time = day.time;
								const timeSpan = time.duration - time.pause;
								monthTimes += timeSpan || 0;
							}
						});
					} else if (dayArray.length === 1) {
						const day = dayArray[0];
						if (day && day.type === "work") {
							const time = day.time;
							const timeSpan = time.duration - time.pause;
							monthTimes += timeSpan || 0;
						} else if (day && day.type === "absence") {
							if (day.is_working_day) {
								monthTimes += day.default_time
									? day.default_time.duration -
										day.default_time.pause
									: 0;
							}
						}
					}
				});
			}
			totalSaldo += monthTimes - target;
			totalTarget += target;
			totalTimes += monthTimes;
			dataArray.push({
				month: month.label,
				monthSaldo: convertMillisecondsToString(monthTimes - target),
				target: convertMillisecondsToString(target),
				monthTimes: convertMillisecondsToString(monthTimes)
			});
		});

		dataArray.push({
			month: "Gesamt",
			monthSaldo: convertMillisecondsToString(totalSaldo),
			target: convertMillisecondsToString(totalTarget),
			monthTimes: convertMillisecondsToString(totalTimes)
		});

		return dataArray;
	}, [days, year, recordData]);

	const secondaryContent = useMemo(
		() => (
			<Table
				data={monthData}
				columns={columns}
				rowStyles={() => ({ textAlign: "right" })}
			/>
		),
		[monthData]
	);

	return (
		<div className="flex col j-sb a-fs">
			{/* <button
				className="full_button md dark"
				onClick={() => setDisplayStaffRecord(true)}
			>
				Zeitüberblick
			</button> */}
			<SlideIn
				header="Zeiten Übersicht"
				cancel={() => setDisplayStaffRecord(false)}
				isOpen={displayStaffRecord}
				confirm={() => setDisplayStaffRecord(false)}
				secondaryContent={secondaryContent}
				showSecondaryContent={true}
			>
				<div>
					<SelectStaff
						staff={staff}
						selectedWorker={selectedWorker}
						setSelectedWorker={setSelectedWorker}
					/>
				</div>
			</SlideIn>
		</div>
	);
};

export default StaffRecord;
