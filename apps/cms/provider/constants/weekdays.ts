
export const weekdays = [
	{
		day: 1,
		index: 0,
		value: 'monday',
		label: 'Montag',
		short: 'Mo'
	},
	{
		day: 2,
		index: 1,
		value: 'tuesday',
		label: 'Dienstag',
		short: 'Di'
	},
	{
		day: 3,
		index: 2,
		value: 'wednesday',
		label: 'Mittwoch',
		short: 'Mi'
	},
	{
		day: 4,
		index: 3,
		value: 'thursday',
		label: 'Donnerstag',
		short: 'Do'
	},
	{
		day: 5,
		index: 4,
		value: 'friday',
		label: 'Freitag',
		short: 'Fr'
	},
	{
		day: 6,
		index: 5,
		value: 'saturday',
		label: 'Samstag',
		short: 'Sa'
	},
	{
		day: 0,
		index: 6,
		value: 'sunday',
		label: 'Sonntag',
		short: 'So'
	}
];

export const getWeekdayLabel = (day: string) => {
	return weekdays.find(weekday => weekday.value === day)?.label || 'Kein Wochentag';
};

export const getWeekday = (day: string) => {
	return weekdays.find(weekday => weekday.value === day);
};
