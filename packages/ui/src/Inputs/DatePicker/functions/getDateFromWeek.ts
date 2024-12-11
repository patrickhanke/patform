function getDateFromWeek(weekNumber: number, dayIndex: number, year?: number) {
	const date = new Date(year ||new Date().getFullYear(), 0, 1);
	const days = (weekNumber - 1) * 7 + dayIndex;
	date.setDate(date.getDate() + days);

	return new Date(date);
}

export default getDateFromWeek;