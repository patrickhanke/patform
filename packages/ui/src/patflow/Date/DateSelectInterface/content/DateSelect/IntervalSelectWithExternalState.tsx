"use client";

import { DateObjectWithNextDates } from "@repo/types";
import DateCategories from "./components/DateCategories";
import SingleDateSelectInterface from "./components/SingleDateSelectInterface";
import MultiDateSelectInterface from "./components/MultiDateSelectInterface";
import IntervalDateSelectInterface from "./components/IntervalDateSelectInterface";
import { DateSelectExternalStateProps } from "./types";
import { Divider } from "@repo/ui";

const DateSelectWithExternalState = ({
	date,
	dataHandler
}: DateSelectExternalStateProps) => {
	if (!date) {
		return <p>Kein Datum angegeben</p>;
	}

	return (
		<>
			<div className="flexbox_column_with_gap">
				<div>
					<label>Interval</label>
				</div>
				<div>
					<label>Kategorie wählen</label>
					<DateCategories
						value={date.category}
						onChange={(value) =>
							dataHandler({
								...date,
								category: value
							})
						}
					/>
				</div>
				<Divider showLine size="medium" />
				<div>
					{date.type.value === "single" && (
						<SingleDateSelectInterface
							date={date}
							category={date.category.value}
							onChange={(newDate: DateObjectWithNextDates) =>
								dataHandler(newDate)
							}
						/>
					)}
					{date.type.value === "multi" && (
						<MultiDateSelectInterface
							date={date}
							category={date.category.value}
							onChange={(newDate: DateObjectWithNextDates) =>
								dataHandler(newDate)
							}
						/>
					)}
					{date.type.value === "interval" && (
						<IntervalDateSelectInterface
							date={date}
							category={date.category.value}
							onChange={(newDate: DateObjectWithNextDates) =>
								dataHandler(newDate)
							}
						/>
					)}
				</div>
			</div>
		</>
	);
};

export default DateSelectWithExternalState;
