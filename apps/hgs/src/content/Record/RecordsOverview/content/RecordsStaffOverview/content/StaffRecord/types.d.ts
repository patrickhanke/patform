import { months } from '@/provider';
import { UserDisplayData } from '@/types';

export type StaffRecordProps = {
    days: RecordData;
    month: typeof months[number];
    year: number;
    user: UserDisplayData;
}

export type MonthData = {
    month: string,
    monthSaldo: string,
    target: string,
    monthTimes: string
}