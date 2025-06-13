import { useMemo } from "react";
import { SiteHeaderContentComponent } from "../types";
import { Select } from "@repo/ui";
import { differenceInCalendarWeeks } from "date-fns";

const WeeklyRecordSiteHeaderContent = ({
	setSelectedWeek,
	selectedWeek
}: SiteHeaderContentComponent) => {
	const weekOptions = useMemo(() => {
		const year = new Date().getFullYear();
		const difference = differenceInCalendarWeeks(
			new Date(year, 12, 31),
			new Date(year, 1, 1),
			{ weekStartsOn: 1 }
		);

		const weeks = Array.from({ length: difference }, (_, i) => i + 1);

		return weeks.map((week) => ({ value: week, label: `KW ${week}` }));
	}, []);

	return (
		<div className="flex row j-sb a-ce">
			<Select
				label=""
				width="90px"
				options={weekOptions}
				value={selectedWeek}
				onChange={(value) => setSelectedWeek(value?.value)}
				placeholder="KW..."
			/>
		</div>
	);
};

export default WeeklyRecordSiteHeaderContent;
