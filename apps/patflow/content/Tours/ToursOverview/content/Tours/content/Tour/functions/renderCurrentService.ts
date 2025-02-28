import { PropertyService } from '@types'
import { eachMonthOfInterval, eachWeekOfInterval, getWeek } from 'date-fns';

type RenderCurrentServiceFunction =(props: {service?: PropertyService, week: number, year: number}) => boolean

const renderCurrentService: RenderCurrentServiceFunction = ({service, week, year}) => {

    if (!service || !week || !year) {
        return false
    }

    console.log({week});
    

    if (service.type === 'interval') {
        const start: Date = new Date(
            year, 
            new Date(service.interval.start_date).getMonth(), 
            new Date(service.interval.start_date).getDate()
        );
        
        const end: Date = service.interval.end_date ? new Date(
            year, 
            new Date(service.interval.end_date).getMonth(), 
            new Date(service.interval.end_date).getDate()
        ) : new Date(year, 11, 31);

        let interval: Date[] = [];

        if (service.interval.unit === 'month') {
            interval = eachMonthOfInterval({
                start: start,
                end: end
            })
        } else if (service.interval.unit === 'weeks') {
            interval = eachWeekOfInterval({
                start: start,
                end: end
            })
        }

        const filteredInterval = interval.filter((_date, index) => index % service.interval.number === 0);
        const filteredIntervalWeeks = filteredInterval.map(date => getWeek(date));

        return filteredIntervalWeeks.includes(week);
    }

    if (service.type === 'dates') {
        const weeks = service.dates.map(date => getWeek(new Date(date)));
        return weeks.includes(week);
    }
    
    return false;
}

export default renderCurrentService