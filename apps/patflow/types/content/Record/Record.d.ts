import { HolidayTemplate, User, UserDisplayData } from '@/types/General';
import { Absence } from '../Worker';
import { DayTime, TimeObject } from './Times';
import { AbsenceStateOptions } from '@types';

export type RecordTimeSettings = {
    hours: number;
    weekdays: number;
    pause: number;
    vacation: number;
    start: string;
};

export type Record = {
    objectId: string;
    createdAt: string;
    year: number;
    user: User;
    absence: Absence[];
    default_times: TimeObject[];
    working_days: Array<DayTime>;
    start_date: string;
    end_date: string;
    time_settings: RecordTimeSettings;
    absence_days: number;
    saldo: number;
    initial_saldo: number;
    initial_vacation: number;
    former_record: Record | undefined;
    holiday_template: HolidayTemplate;
};

export type Abence = {
    objectId: string;
    state: AbsenceStateOptions[number]['value'];
    user: UserDisplayData;
    comment: string;
    type: 'vacation' | 'illness' | 'other';
    year: number;
};
