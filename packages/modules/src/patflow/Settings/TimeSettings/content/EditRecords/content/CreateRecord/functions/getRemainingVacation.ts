import { Day, Record } from "@repo/types";
import { differenceInMonths } from "date-fns";

const getRemainingVacation: (
	start_date: string,
	end_date: string,
	record: Record,
	days: Day[]
) => number = (start_date, end_date, record, days) => {
	const former_vacation = record?.time_settings.vacation || 0;
	const initial_vacation = 0 + former_vacation;
	const difference = differenceInMonths(
		new Date(end_date),
		new Date(start_date)
	);

	let vacation = 0;
	if (difference === 12) {
		vacation = initial_vacation;
	} else {
		vacation = Math.ceil((initial_vacation / 12) * difference);
	}

	days.forEach((day) => {
		const date = new Date(day.date).getTime();

		if (
			date >= new Date(start_date).getTime() &&
			date <= new Date(end_date).getTime() &&
			day.type === "absence" &&
			day?.absence?.type === "vacation"
		) {
			if (day?.default_time?.type === "regular") {
				vacation -= 1;
			}
		}
	});

	return vacation;
};

export default getRemainingVacation;
