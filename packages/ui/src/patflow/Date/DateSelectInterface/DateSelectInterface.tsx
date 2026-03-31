"use client";

import { useState } from "react";
import DateSelect from "./content/DateSelect";
import TimeDisplay from "./content/TimeDisplay";
import { date_select_options } from "./constants/date_select_options";
import { DateObject } from "@repo/types";
import { SlideIn } from "@repo/ui";

const DateSelectInterface = ({
	onChange
}: {
	onChange: (value: DateObject) => void;
}) => {
	const [isOpen, setIsOpen] = useState(false);

	const [date, setDate] = useState({
		week_array: [],
		interval: date_select_options[0],
		start_week: NaN,
		end_week: NaN,
		weekday: undefined,
		time: undefined
	} as any);

	const dateHandler = (value: DateObject) => {
		setDate(value);
	};

	return (
		<>
			<div>
				<TimeDisplay date={date} />
			</div>
			<SlideIn
				size="medium"
				header="Zeit bearbeiten"
				isOpen={isOpen}
				cancel={() => setIsOpen(false)}
				confirm={() => onChange(date)}
				preventClickOutside
			>
				<DateSelect
					initialValue={date}
					dataHandler={dateHandler}
					setShowSlideIn={setIsOpen}
				/>
			</SlideIn>
		</>
	);
};

export default DateSelectInterface;
