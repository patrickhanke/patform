import { Surcharge } from '@types';
import { FindSurchargesForDay } from '../types';

const findSurchargesForDay: FindSurchargesForDay = ({ day, surcharges }) => {
    if (!day.date || day.type === 'absence') {
        return [];
    }
    const surchargeArray: Surcharge[] = [];

    surcharges.forEach(surcharge => {
        if (
            new Date(surcharge.start_date).getTime() <=
                new Date(day.date).getTime() &&
            (surcharge.end_date
                ? new Date(surcharge.end_date).getTime() >=
                  new Date(day.date).getTime()
                : true)
        ) {
            surchargeArray.push(surcharge);
        }
    });

    return surchargeArray;
};

export default findSurchargesForDay;
