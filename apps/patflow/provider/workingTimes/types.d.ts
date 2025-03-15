import { Day, Surcharge } from '@types';

export type PeriodObject = {
    days: Day[];
    time_overview: {
        label: 'Zeitenübersicht';
        time: {
            label: 'Arbeitszeit';
            value: 0;
        };
        target: {
            label: 'Sollzeit';
            value: 0;
        };
        breaks: {
            label: 'Pausenzeit';
            value: 0;
        };
        saldo: {
            label: 'Saldo';
            value: 0;
        };
    };
    surcharges: {
        label: 'Zuschläge';
    };
    vacation: 0;
    absence: 0;
    working_days: 0;
};

export type GetWorkingTimes = ({ days }: { days: Day[] }) => PeriodObject;

export type FindSurchargesForDay = ({
    day,
    surcharges,
}: {
    day: Day;
    surcharges: Surcharge[];
}) => Surcharge[];

export type CheckSurchargeCondition = ({
    day,
    surcharge,
}: {
    day: Day;
    surcharge: Surcharge;
}) => number;
