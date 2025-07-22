import { Day } from "@repo/types";
import { createDateIntervalForMonth } from "@repo/provider";
import { getWeek } from "date-fns";
import { get, set } from "lodash-es";

const getOvertimeSaldo = ({
	days,
	surchargeId,
	year,
	month
}: {
	days: Day[];
	surchargeId: string;
	year: number;
	month: number;
}) => {
	const dateInterval = createDateIntervalForMonth(year, month);

	const dayArray = days.filter((dayToFind: Day) =>
		dateInterval.includes(dayToFind.date)
	);

	// Sort the dayArray by date to ensure they are in order
	const sortedDayArray = dayArray.sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
	);

	const weeks: { [key: string]: Day[] } = {};

	sortedDayArray.forEach((day) => {
		const date = new Date(day.date);

		const week = getWeek(date, { weekStartsOn: 1 });
		// If it's Sunday or the first day, start a new week
		const currentWeek: Day[] = get(weeks, week, []);
		currentWeek.push(day);
		set(weeks, week.toString(), currentWeek);
	});

	console.log({ weeks });

	// push the last week if it has days

	const saldo = 0;
	let weeklySaldo = 0;
	let monthlySaldo = 0;
	Object.keys(weeks).forEach((week) => {
		const currentWeek = weeks[week];
		if (currentWeek && currentWeek.length > 0) {
			let weekSaldo = 0;
			currentWeek.forEach((day) => {
				if (day.surcharges) {
					const surcharge = day.surcharges.find(
						(s) => s.surcharge_id === surchargeId
					);
					if (surcharge && surcharge.saldo) {
						weekSaldo += surcharge.saldo;
					}
				}
				console.log(week);
				console.log(weekSaldo);
				if (day.saldo && day.saldo < 0) {
					console.log({ saldo: day.saldo });
					weekSaldo += day.saldo;
				}
			});
			if (weekSaldo > 0) {
				weeklySaldo += weekSaldo;
			}
		}
	});

	sortedDayArray.forEach((day) => {
		if (day.surcharges) {
			const surcharge = day.surcharges.find(
				(s) => s.surcharge_id === surchargeId
			);
			if (surcharge && surcharge.saldo) {
				monthlySaldo += surcharge.saldo;
			}
		}
		if (day.saldo && day.saldo < 0) {
			monthlySaldo += day.saldo;
		}
	});

	return {
		saldo: saldo,
		weeklySaldo: weeklySaldo,
		monthlySaldo: monthlySaldo > 0 ? monthlySaldo : 0
	};
};

export default getOvertimeSaldo;
