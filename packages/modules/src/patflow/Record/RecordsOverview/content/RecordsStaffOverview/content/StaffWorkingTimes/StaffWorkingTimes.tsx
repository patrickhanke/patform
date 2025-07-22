import { FC, useCallback, useMemo } from "react";
import { Table } from "@repo/ui";
import { DayData, StaffWorkingTimesProps } from "./types";
import { eachDayOfInterval, formatISO9075, isWeekend } from "date-fns";
import useTableColumns from "./hooks/useTableColumns";
import { Row } from "@tanstack/react-table";
import { Day } from "@repo/types";
import { findDefaultTimeForDate } from "@repo/provider";
import { set, get, cloneDeep, isArray } from "lodash-es";

const StaffWorkingTimes: FC<StaffWorkingTimesProps> = ({
	days,
	month,
	year,
	refetch,
	selectedUser,
	records
}) => {
	const columns = useTableColumns({
		refetch,
		userId: selectedUser?.value,
		records
	});

	const rowStyles = useCallback((row: Row<Day>) => {
		if (isWeekend(row.original.date)) {
			return { backgroundColor: "#f0f0f0" };
		}
		return { backgroundColor: "transparent" };
	}, []);

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

				interval.push({
					date: daysToFind[0].date,
					is_working_day: daysToFind[0].is_working_day,
					default_time: daysToFind[0].default_time,
					time: timeArray,
					absence: daysToFind[0].absence,
					type: daysToFind[0].type,
					surcharges: getSurchagesFromDays(daysToFind)
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
					surcharges: []
				});
			}
		});

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
				/>
			</div>
		</div>
	);
};

export default StaffWorkingTimes;
