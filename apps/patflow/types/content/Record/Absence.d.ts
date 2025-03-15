import { UserDisplayData } from '@/types/General';
import { AbsenceStateOptions } from '../Day';

export type Absence = {
    objectId: string;
    state: AbsenceStateOptions[number]['value'];
    user: UserDisplayData;
    comment: string;
    type: 'vacation' | 'illness' | 'other';
    year: number;
    start_date: string;
    end_date: string;
};
