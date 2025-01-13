import { ProjectTypes } from '@types';

export type HolidaysProps = {
    holidays: holiday[];
};

export type HolidayChangeHandler = (id: string, value: boolean) => void;

export type HolidayElementProps = {
    holiday: ProjectTypes.Holiday;
    index: number;
    holidayChangeHandler: HolidayChangeHandler;
};