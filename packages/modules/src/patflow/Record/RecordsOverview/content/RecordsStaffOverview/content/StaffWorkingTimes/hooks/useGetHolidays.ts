import { generateGraphQLQuery, UserContext } from "@repo/provider";
import { useQuery } from "@apollo/client";
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
	const { data: holidayData, refetch: refetchHolidays } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Holiday",
			fields: ["objectId", "name", "label", "type", "dates"]
		}),
		{
			variables: {
				params: {
					type: { _eq: "holiday" },
					project: { _eq: projectId }
				}
			},
			skip: !projectId
		}
	);

	const currentHolidays = useMemo(() => {
		const holidays: Holiday[] =
			holidayData?.objects.findHoliday.results || [];
		console.log(holidays);

		if (!year) {
			return [];
		}

		const recordHolidays: Holiday[] = [];

		holidays.forEach((holiday) => {
			const date = holiday.dates[year.toString()];
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
				console.log({ recordForHoliday });
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

	console.log(currentHolidays);

	return {
		holidays: holidayData?.objects.findHoliday.results || [],
		currentHolidays
	} as {
		holidays: Holiday[];
		currentHolidays: Holiday[];
	};
};

export default useGetHolidays;
