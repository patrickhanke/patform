import { isWeekend } from 'date-fns';

const checkForWorkingDay: (date: Date) => boolean = (date: Date) => {
	if (isWeekend(date)) {
		return false;
	}
	return true;
};

export default checkForWorkingDay;