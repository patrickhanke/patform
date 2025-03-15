import { getWeek } from 'date-fns';

const transformWeekValue = (date: string) => {
    if (date) {
        const d = new Date(date);
        const week = getWeek(d, { weekStartsOn: 1 }).toString();
        const year = d.getFullYear();

        return `${year}-W${week.length === 1 ? '0' + week : week}`;
    }

    return '';
};

export default transformWeekValue;
