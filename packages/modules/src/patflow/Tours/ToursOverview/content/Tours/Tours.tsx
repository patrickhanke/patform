import { PatflowAppContext } from "@repo/provider";
import React, { FC, useContext, useEffect, useMemo } from "react";
import Tour from "./content/Tour";
import { ToursProps } from "./types";
import { differenceInCalendarISOWeeks } from "date-fns";
import { EventCalendar, Select } from "@repo/ui";
import { SelectOption } from "@repo/types";
import useTourStore from "./hooks/useTourStore";

const Tours: FC<ToursProps> = ({ projectId, setPageHeaderContent }) => {
	const { year } = useContext(PatflowAppContext);

	const week = useTourStore((state) => state.week);
	const worker = useTourStore((state) => state.worker);
	const setWorker = useTourStore((state) => state.setWorker);
	const setWeek = useTourStore((state) => state.setWeek);

	const weekOptions: SelectOption[] = useMemo(() => {
		const weeks = differenceInCalendarISOWeeks(
			new Date(year, 11, 31),
			new Date(year, 0, 1)
		);
		const weekOptions = [];
		for (let i = 0; i <= weeks; i += 1) {
			if (i === 0) {
				weekOptions.push({ label: "Übersicht", value: 0, id: "0" });
			} else {
				weekOptions.push({
					label: `KW ${i}`,
					value: i,
					id: i.toString()
				});
			}
		}
		return weekOptions;
	}, [year]);

	const pageHeaderContent = useMemo(() => {
		return (
			<div className="button_container">
				<Select
					value={week}
					onChange={(value) => setWeek(value)}
					options={weekOptions}
				/>
			</div>
		);
	}, [week, worker]);

	useEffect(() => {
		setPageHeaderContent(pageHeaderContent);
	}, [week, worker]);

	return (
		<div>
			<p>Test</p>
			<EventCalendar dates={[]} />
			{/* {worker && week && (
				<Tour projectId={projectId} workerId={worker} year={year} />
			)} */}
		</div>
	);
};

export default Tours;
