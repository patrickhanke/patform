import { useContext, useState, useMemo } from "react";
import { PatflowAppContext, useDataStore, useFindDays } from "@repo/provider";
import MonthlyCalendarGrid from "./components/MonthlyCalendarGrid";
import "./RecordsCalendar.scss";

const RecordsCalendar = () => {
	const { year } = useContext(PatflowAppContext);
	const { workers } = useDataStore();
	const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

	const { data: days } = useFindDays({
		year: year,
		month: selectedMonth
	});

	const currentMonth = useMemo(() => {
		return new Date(year, selectedMonth, 1);
	}, [year, selectedMonth]);

	const months = [
		"Januar",
		"Februar",
		"März",
		"April",
		"Mai",
		"Juni",
		"Juli",
		"August",
		"September",
		"Oktober",
		"November",
		"Dezember"
	];

	return (
		<div className="records-calendar">
			<div className="calendar-controls">
				<label htmlFor="month-select">Monat:</label>
				<select
					id="month-select"
					value={selectedMonth}
					onChange={(e) => setSelectedMonth(Number(e.target.value))}
					className="month-select"
				>
					{months.map((month, index) => (
						<option key={index} value={index}>
							{month}
						</option>
					))}
				</select>
			</div>
			<MonthlyCalendarGrid
				workers={workers}
				month={currentMonth}
				days={days}
			/>
		</div>
	);
};

export default RecordsCalendar;
