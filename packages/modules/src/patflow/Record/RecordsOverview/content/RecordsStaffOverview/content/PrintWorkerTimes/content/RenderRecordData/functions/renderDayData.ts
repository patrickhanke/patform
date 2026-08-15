import { eachDayOfInterval, formatISO9075 } from "date-fns";
import { Day } from "@repo/types";
import { cloneDeep, get, isArray, set } from "lodash-es";
import { findDefaultTimeForDate } from "@repo/provider";
import { DayData, RenderDayData } from "../types";

const renderDayData: RenderDayData = ({ year, month, days, records }) => {
	const interval: DayData[] = [];
	const startDay = new Date(year, month, 1);
	const endDay = new Date(year, month + 1, 0);
	const dayInterval = eachDayOfInterval(
		{
			start: startDay,
			end: endDay
		},
		{ step: 1 }
	);

	const getSurchagesFromDays = (dayList: Day[]) => {
		let surcharges: Day["surcharges"] = [];

		dayList.forEach((day) => {
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
		const daysToFind: Day[] = days.filter((day) => day.date === dateString);

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
				times: timeArray,
				surcharges: getSurchagesFromDays(daysToFind),
				comment: allComments,
				absence: daysToFind[0].absence,
				type: daysToFind[0].type
			});
		} else {
			interval.push({
				date: dateString,
				is_working_day: def.is_working_day,
				default_time: def.default_time,
				times: [],
				surcharges: [],
				comment: undefined,
				absence: null,
				type: "initial"
			});
		}
	});

	return interval;
};

export default renderDayData;
