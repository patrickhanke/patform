import { FC, useCallback, useMemo } from "react";
import { Table } from "@repo/ui";
import { DayData, StaffWorkingTimesProps } from "./types";
import { eachDayOfInterval, formatISO9075, isWeekend } from "date-fns";
import useTableColumns from "./hooks/useTableColumns";
import { Row } from "@tanstack/react-table";
import { Day, Holiday } from "@repo/types";
import {
	dateHasRecord,
	findDefaultTimeForDate,
	useDataStore
} from "@repo/provider";
import { set, get, cloneDeep, isArray } from "lodash-es";

const StaffWorkingTimes: FC<StaffWorkingTimesProps> = ({
	days,
	month,
	year,
	refetch,
	selectedUser,
	records
}) => {
	const { holidays, surcharges } = useDataStore();

	const currentHolidays = useMemo(() => {
		if (!year || !records.length) {
			return [];
		}

		const recordHolidays: Holiday[] = [];
		const addedHolidayIds = new Set<string>();

		holidays.forEach((holiday) => {
			const date = holiday.dates.find(
				(dt) => new Date(dt).getFullYear() === year
			);
			if (!date) {
				return;
			}

			const isRecordHoliday = records.some((record) => {
				if (!record.surcharges?.length) {
					return false;
				}

				return record.surcharges.some((surchargeId: string) => {
					const surcharge = surcharges.find(
						(s) => s.objectId === surchargeId
					);

					if (!surcharge?.day_value?.length) {
						return false;
					}

					return surcharge.day_value.includes(holiday.objectId);
				});
			});

			if (isRecordHoliday && !addedHolidayIds.has(holiday.objectId)) {
				addedHolidayIds.add(holiday.objectId);
				recordHolidays.push(holiday);
			}
		});

		return recordHolidays;
	}, [holidays, year, records, surcharges]);

	const { columns, secondaryRow } = useTableColumns({
		refetch,
		userId: selectedUser?.value,
		records,
		holidays: currentHolidays,
		days
	});

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
			const dateString = formatISO9075(element, {
				representation: "date"
			});
			const def = findDefaultTimeForDate(dateString, records);
			const hasRecord = dateHasRecord(dateString, records);
			const daysToFind: Day[] | undefined = days.filter(
				(day) => day.date === dateString
			);

			console.log({ daysToFind });

			if (isArray(daysToFind) && daysToFind.length > 0) {
				const timeArray: DayData["times"] = [];
				daysToFind.forEach((day) => {
					if (day.time) {
						timeArray.push({
							saldo: day.saldo,
							time: day.time,
							day_id: day.objectId,
							absence: day.absence,
							type: day.type,
							worktime: day.worktime || 0
						});
					}
				});

				if (!daysToFind[0]) {
					return;
				}

				const allComments = daysToFind
					.map((day) => day.comment)
					.join(" - ");
				interval.push({
					date: daysToFind[0].date,
					is_working_day: def.is_working_day,
					default_time: def.default_time,
					has_record: hasRecord,
					times: timeArray,
					surcharges: getSurchagesFromDays(daysToFind),
					comment: allComments
				});
			} else {
				interval.push({
					date: dateString,
					is_working_day: def.is_working_day,
					default_time: def.default_time,
					has_record: hasRecord,
					times: [],
					time: undefined,
					absence: null,
					type: "initial",
					surcharges: [],
					comment: undefined
				});
			}
		});

		return interval;
	}, [days, month, year, records]);

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
		[currentHolidays, year, tableData]
	);

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
