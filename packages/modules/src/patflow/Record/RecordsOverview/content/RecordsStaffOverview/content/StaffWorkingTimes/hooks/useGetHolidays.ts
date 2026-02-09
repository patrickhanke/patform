import { useFindData, UserContext } from "@repo/provider";
import { useContext, useMemo } from "react";
import { Holiday, Record } from "@repo/types";

const useGetHolidays = ({
	year,
	records
}: {
	year: number;
	records: Record[];
}) => {
	const { projectId } = useContext(UserContext);
	const { data: holidayData } = useFindData({
		objectName: "Holiday",
		fields: ["objectId", "name", "label", "type", "dates"],
		filters: [{ key: "type", value: "holiday", operator: "equalTo" }],
		projectId,
		skipQuery: !projectId
	});

	const currentHolidays = useMemo(() => {
		const holidays: Holiday[] = holidayData || [];

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

			if (recordForHoliday) {
				if (
					recordForHoliday.holiday_template.holidays.includes(
						holiday.objectId
					)
				) {
					recordHolidays.push(holiday);
				}
			}
		});

		return recordHolidays;
	}, [holidayData, year, records]);

	return {
		holidays: holidayData || [],
		currentHolidays
	} as {
		holidays: Holiday[];
		currentHolidays: Holiday[];
	};
};

export default useGetHolidays;
