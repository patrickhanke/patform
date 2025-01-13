import { Day, Record, StaffMember } from '@types';
import { Dispatch, SetStateAction } from 'react';

export type CreateRecordProps = {
    createRecord: boolean,
    setCreateRecord: Dispatch<SetStateAction<boolean>>,
    userId: string, 
    timeSettings: StaffMember['time_settings'],
    refetch: () => void,
    projectId: string,
}

export type UserSelectProps = {
    worker: StaffMember,
    isSelected: boolean,
    onChange: (action: 'add' | 'remove', id: string) => void,
}

export type RecordSettingsProps = {
    record: Record,
    days: Day[]
}