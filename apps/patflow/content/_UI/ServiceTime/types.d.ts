import { DateTypes } from '@types';

export type Intervals = 'weekly' | 'biweekly' | 'monthly' | 'individual';
export type IntervalOption = {
    value: Intervals;
    id: Intervals;
    label: string;
};

export type ServiceTimeData = {
    interval: IntervalOption[][number]['value'];
    starttime: DateTypes.TDateISO;
    endtime: DateTypes.TDateISO;
};

export type ServiceTimeDataKey = keyof ServiceTimeData;

export type ServiceTimeDataValue = ServiceTimeData[keyof ServiceTimeData];

export type ServiceTimeComponent = {
    data: ServiceTimeData;
    dataHandler: (T: ServiceTimeData) => void;
};
