import { weekdays } from '@provider';
import { CheckSurchargeCondition } from '../types';
import { getISODay } from 'date-fns';

const checkSurchargeDayCondition: CheckSurchargeCondition = ({
    day,
    surcharge,
}) => {
    if (day.date) {
        if (surcharge.day_value.includes(day.date)) {
            return day.time.duration - day.time.pause;
        }
        const getDay = weekdays.find(
            weekday => weekday.index === getISODay(new Date(day.date)) - 1
        );

        if (getDay && surcharge.day_value.includes(getDay.value)) {
            console.log(day.time.duration - day.time.pause);

            return day.time.duration - day.time.pause;
        }
    }
    return 0;
};

export default checkSurchargeDayCondition;
