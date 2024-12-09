import { ViewState } from './content/CalendarHeader/types';

export type CalendarDayElement = {
    dataType: string,
    dataLength: number,
    dataColor: string, 
    [key: string]: any
};

export type CalendarData = {[key: string]: CalendarDayElement[]};

export type CalendarProps = {
   data: CalendarData
};

export type Day = string;

export type Week = {
    id: string,
    days: string[]
}

export type WeekInterval = Week[];

export type UseCreateIntervalHook = ({view} : {view: ViewState}) => WeekInterval[];