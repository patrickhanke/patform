import { months } from '@provider';
import { Record } from '@types';

type Month = (typeof months)[number];

type CalculateWorkingTimes = ({
    record,
    month,
    year,
}: {
    record: Record;
    month: Month;
    year: number;
}) => void;

const calculateWorkingTimes: CalculateWorkingTimes = ({
    record,
    month,
    year,
}) => {
    const isWeekend = (date: Date): boolean => {
        const day = date.getDay();
        return day === 0 || day === 6; // Sunday or Saturday
    };

    const holidays: Date[] = []; // Add holiday dates here

    let workingDays = 0;

    for (let m = 0; m < 12; m++) {
        const daysInMonth = new Date(year, m + 1, 0).getDate();
        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, m, d);
            if (
                !isWeekend(date) &&
                !holidays.some(holiday => holiday.getTime() === date.getTime())
            ) {
                workingDays++;
            }
        }
    }
};

export default calculateWorkingTimes;
