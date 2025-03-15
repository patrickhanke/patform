import { Record } from '@types';

const defaultRecord: (year: number) => Partial<Record> = year => {
    return {
        year,
        absence: [],
        default_times: [],
        working_days: [],
        start_date: `${year}-01-01`,
        end_date: `${year}-12-31`,
        time_settings: {
            hours: 40,
            weekdays: 5,
            pause: 30,
            vacation: 30,
            start: '8:00',
        },
        absence_days: 0,
        saldo: 0,
        initial_saldo: 0,
        initial_vacation: 0,
        former_record: undefined,
        holiday_template: undefined,
    };
};

export default defaultRecord;
