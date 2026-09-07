import { Record } from "@repo/types";
import { createDefaultWeekdaySettings, getWeeklyHours } from "@repo/provider";

const defaultRecord: (year: number) => Partial<Record> = (year) => {
	const weekdays = createDefaultWeekdaySettings();

	return {
		year,
		absence: [],
		default_times: [],
		start_date: `${year}-01-01`,
		end_date: `${year}-12-31`,
		time_settings: {
			hours: getWeeklyHours(weekdays),
			weekdays,
			vacation: 30
		},
		absence_days: 0,
		saldo: 0,
		initial_saldo: 0,
		initial_vacation: 0,
		former_record: undefined
	};
};

export default defaultRecord;
