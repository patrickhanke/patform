import { DateTypes } from '@/types';
import { Day, eachMonthOfInterval, eachWeekOfInterval, formatISO9075, getDay, getYear, parse } from 'date-fns';

const getDatesFromInterval = (dateObject: DateTypes.DateObjectWithNextDates) => {
    
	if (dateObject.type.value === 'weekly' && dateObject.start_date) {
		// const [startYear, startWeek] = dateObject.start_date.split('-W');
		const [endYear, endWeek] = dateObject.end_date ?  dateObject.end_date.split('-W') : [2024, '52'];
		// const start = parse(startWeek, 'I', new Date());
		const start = dateObject.start_date;
		const end = parse(endWeek, 'I', new Date()) || new Date(getYear(endYear), 11, 31);

		const startHours = new Date(start).getHours();
		const startMinutes = new Date(start).getMinutes();
        
		const interval = eachWeekOfInterval (
			{
				start,
				end
			}, {
				weekStartsOn: getDay(start) as Day,
				step: Number(dateObject.interval || 1)
			});
			
		const filteredInterval = interval.filter(date => date > new Date());

		return ({
			allDates: interval.map(date => formatISO9075( new Date(date.getFullYear(), date.getMonth(), date.getDate(), startHours, startMinutes))),
			nextDates: filteredInterval.map(date => formatISO9075( new Date(date.getFullYear(), date.getMonth(), date.getDate(), startHours, startMinutes), {representation: 'date'}))
		});
			
	}
	if (dateObject.type.value === 'monthly' && dateObject.start_date) {
		// const [startYear, startWeek] = dateObject.start_date.split('-W');
		const [endYear, endWeek] = dateObject.end_date ?  dateObject.end_date.split('-W') : [2024, '52'];
		// const start = parse(startWeek, 'I', new Date());
		const start = dateObject.start_date;
		const end = parse(endWeek, 'I', new Date()) || new Date(getYear(endYear), 11, 31);

		const startHours = new Date(start).getHours();
		const startMinutes = new Date(start).getMinutes();
		const startDate = new Date(start).getDate();
        
		const interval = eachMonthOfInterval (
			{
				start,
				end
			}, {
				step: Number(dateObject.interval || 1)
			});

		const filteredInterval = interval.filter(date => date > new Date());

		const allDates = interval.map(date => formatISO9075( new Date(date.getFullYear(), date.getMonth(), startDate, startHours, startMinutes)));
		return ({
			allDates: allDates,
			nextDates: filteredInterval.map(date => formatISO9075( new Date(date.getFullYear(), date.getMonth(), startDate, startHours, startMinutes), {representation: 'date'}))
		});
    
	}
	return ({
		allDates: [],
		nextDates: []
	});
};

export default getDatesFromInterval;