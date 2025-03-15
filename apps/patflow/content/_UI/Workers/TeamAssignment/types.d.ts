import { ReactNode } from 'react';

export type TeamAssignmentsProps = {
    workers: Worker['objectId'][];
    onChange: (worker: WorkerOption[]) => void;
    showAsButton?: boolean;
};

export type WorkerOption = {
    value: string;
    id: string;
    label: string;
    element: ReactNode;
};

export type DisplayWorkersProps = {
    workers: Worker['objectId'][];
    onChange: (worker: WorkerOption[]) => void;
    showAsButton?: boolean;
};
