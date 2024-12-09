import { WorkerTypes } from '@/types';

export type DisplayWorkersProps =  {
    workerId: WorkerTypes.Worker['objectId'], 
    nextDate?: string, 
    showAvailability?: boolean, 
    removeWorker?: (ID: string) => void, 
    onlyImage?: boolean
};
