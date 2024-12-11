import { AbsenceTypes, Record } from '@types';
import { User } from '@/types/General/User';

export type GetRecordObject = {
    loading: boolean;
    absences: AbsenceTypes.Absence[];
    refetch: () => void;
  };
  
export type WeekObject = {
    record: Record,
    user: User,
    state: 'submitted' | 'approved' | 'rejected' ,
    working_days: number,
    holidays: number,
    absence: number,
    vacation: number,
    time: number,
    breaks: number,
    dayKeys: string[]
  };
  
export type DateMonthRecord = WeekObject;

export type RecordsCalendarProps = {
    records: Record[];
};

export type DayState = 'open' | 'completed' | 'vacation' | 'sick' | 'holiday';

export type SiteHeaderContentComponent = {
  id?: string,
  filters: ApplicationTypes.Filter[],
  setFilters: React.Dispatch<React.SetStateAction<ApplicationTypes.Filter[]>>,
  selectedWeek: number,
  setSelectedWeek: React.Dispatch<React.SetStateAction<number>>
}
