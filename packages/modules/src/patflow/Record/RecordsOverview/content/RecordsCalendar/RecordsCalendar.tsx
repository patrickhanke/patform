import React, { useMemo } from "react";
import { RecordsCalendarProps } from "./types";
import { eachDayOfInterval, formatISO9075 } from "date-fns";
import { get, set } from "lodash-es";
import { absence_type_options, useFindData } from "@repo/provider";
import { Absence, PatflowUser } from "@repo/types";
import { Calendar, CalendarData } from "@repo/ui";

const RecordsCalendar = ({ records }: RecordsCalendarProps) => {
	const { data: staffData } = useFindData({
		objectName: "User",
		fields: ["objectId", "first_name", "last_name", "is_worker", "portrait", "color", "time_settings", "number", "data", "role { objectId name type color }"],
		filters: [{ key: "is_worker", value: true, operator: "_eq" }],
		order: "last_name_DESC"
	});

	const absences = useMemo(() => {
		const absence = records.map((record) => record.absence).flat();
		return absence;
	}, [records]);

	const calendarData = useMemo(() => {
		const data: CalendarData = {};
		const staff = staffData || [];
		if (staff.length === 0) {
			return data;
		}
		absences.forEach((absence: Absence) => {
			if (absence.state === "approved") {
				const user = staff.find(
					(user: PatflowUser) =>
						user.objectId === absence.user.objectId
				);
				const start = new Date(absence.start_date);
				const end = new Date(absence.end_date);
				const dayInterval = eachDayOfInterval(
					{
						start,
						end
					},
					{ step: 1 }
				);

				dayInterval
					.map((day) =>
						formatISO9075(day, { representation: "date" })
					)
					.forEach((day, index) => {
						const dayElement = get(data, day, undefined);

						if (!dayElement) {
							set(data, day, [
								{
									...absence,
									dataType: "absence",
									dataColor: user.color,
									dataLength: dayInterval.length,
									dataIndex: index,
									dataTitle: `${user.first_name} ${user.last_name} - ${absence_type_options.find((option) => option.value === absence.type)?.label}`
								}
							]);
						} else if (data[day]) {
							data[day].push({
								...absence,
								dataType: "absence",
								dataColor: user.color,
								dataLength: dayInterval.length,
								dataIndex: index,
								dataTitle: absence.type
							});
						}
					});
			}
		});

		return data;
	}, [records, absences, staffData]);

	return (
		<>
			<p>Kalender ist noch nicht eingebunden!</p>
			<Calendar data={calendarData} />
		</>
	);
};

export default RecordsCalendar;
