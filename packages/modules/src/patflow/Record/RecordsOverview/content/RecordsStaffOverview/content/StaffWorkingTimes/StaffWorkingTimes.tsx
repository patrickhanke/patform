import { FC, useCallback, useMemo } from "react";
import { Table } from "@repo/ui";
import { DayData, StaffWorkingTimesProps } from "./types";
import { eachDayOfInterval, formatISO9075, isWeekend } from "date-fns";
import useTableColumns from "./hooks/useTableColumns";
import { Row } from "@tanstack/react-table";
import { Day, Holiday } from "@repo/types";
import { findDefaultTimeForDate, useDataStore } from "@repo/provider";
import { set, get, cloneDeep, isArray } from "lodash-es";

const StaffWorkingTimes: FC<StaffWorkingTimesProps> = ({
	days,
	month,
	year,
	refetch,
	selectedUser,
	records
}) => {
	const { holidays } = useDataStore();
	console.log(holidays);
	console.log(year);

	const currentHolidays = useMemo(() => {
		if (!year) {
			return [];
		}

		const recordHolidays: Holiday[] = [];

		holidays.forEach((holiday) => {
			const date = holiday.dates.find(
				(dt) => new Date(dt).getFullYear() === year
			);
			if (!date) {
				return [];
			}

			console.log(date);
			console.log(records);

			const recordForHoliday = records.find((record) =>
				record.start_date <= record.end_date &&
				new Date(record.start_date).getTime() <=
					new Date(record.end_date).getTime()
					? new Date(record.start_date).getTime() <=
							new Date(date).getTime() &&
						new Date(record.end_date).getTime() >=
							new Date(date).getTime()
					: false
			);
			console.log({ recordForHoliday });

			if (recordForHoliday) {
				if (
					recordForHoliday?.holiday_template?.holidays?.includes(
						holiday.objectId
					)
				) {
					recordHolidays.push(holiday);
				}
			}
		});

		return recordHolidays;
	}, [holidays, year, records]);

	const { columns, secondaryRow } = useTableColumns({
		refetch,
		userId: selectedUser?.value,
		records,
		holidays: currentHolidays,
		days
	});

	const rowStyles = useCallback(
		(row: Row<DayData>) => {
			if (
				currentHolidays.find(
					(holiday) =>
						holiday.dates?.find(
							(dt) => new Date(dt).getFullYear() === year
						) === row.original.date
				)
			) {
				return { backgroundColor: "rgba(86, 138, 212, 0.4)" };
			}
			if (isWeekend(row.original.date)) {
				return { backgroundColor: "#f5f5f5ff" };
			}

			return { backgroundColor: "transparent" };
		},
		[holidays, year]
	);

	const tableData = useMemo(() => {
		const interval: DayData[] = [];
		const startDay = new Date(year, month.id, 1);
		const endDay = new Date(year, month.id + 1, 0);
		const dayInterval = eachDayOfInterval(
			{
				start: startDay,
				end: endDay
			},
			{ step: 1 }
		);

		const getSurchagesFromDays = (days: Day[]) => {
			let surcharges: Day["surcharges"] = [];

			days.forEach((day) => {
				const surchargesCopy = cloneDeep(surcharges);
				if (day.surcharges && day.surcharges.length > 0) {
					day.surcharges.forEach((surcharge) => {
						const surchargeIndex = surcharges.findIndex(
							(s) => s.surcharge_id === surcharge.surcharge_id
						);
						if (surchargeIndex === -1) {
							surchargesCopy.push(surcharge);
						} else {
							const currentSaldo = get(
								surchargesCopy,
								`[${surchargeIndex}].saldo`
							);
							set(
								surchargesCopy,
								`[${surchargeIndex}].saldo`,
								currentSaldo + surcharge.saldo
							);
						}
					});
				}
				surcharges = surchargesCopy;
			});

			return surcharges;
		};

		console.log({ days: days.filter((day) => day.month === 3) });
		dayInterval.forEach((element: Date) => {
			const daysToFind: Day[] | undefined = days.filter(
				(day) =>
					day.date ===
					formatISO9075(element, { representation: "date" })
			);

			if (isArray(daysToFind) && daysToFind.length > 0) {
				const timeArray: DayData["time"] = [];
				daysToFind.forEach((day) => {
					if (day.time) {
						timeArray.push({
							...day.time,
							day_id: day.objectId
						});
					}
				});
				if (!daysToFind[0]) {
					return;
				}

				console.log({ daysToFind });
				console.log({ timeArray });

				const allComments = daysToFind
					.map((day) => day.comment)
					.join(" - ");

				interval.push({
					date: daysToFind[0].date,
					is_working_day: daysToFind[0].is_working_day,
					default_time: daysToFind[0].default_time,
					time: timeArray,
					absence: daysToFind[0].absence,
					type: daysToFind[0].type,
					surcharges: getSurchagesFromDays(daysToFind),
					comment: allComments
				});
			} else {
				const def = findDefaultTimeForDate(
					formatISO9075(element, { representation: "date" }),
					records
				);
				interval.push({
					date: formatISO9075(element, { representation: "date" }),
					is_working_day: def.is_working_day,
					default_time: def.default_time,
					time: undefined,
					absence: null,
					type: "initial",
					surcharges: [],
					comment: undefined
				});
			}
		});

		console.log({ interval });

		return interval;
	}, [days, month, year]);

	return (
		<div>
			<h3>Arbeitszeiten</h3>
			<div className="content_element no_padding">
				<Table
					data={tableData}
					columns={columns}
					rowStyles={rowStyles}
					secondaryRow={secondaryRow}
				/>
			</div>
		</div>
	);
};

export default StaffWorkingTimes;
