import { ApolloRefetch } from '@repo/types';
import { TaskState } from './Task';

export type TeamAssignmentsProps = {
    propertyId: string,
    showAsButton?: boolean,
}

export type DisplayWorkersProps = {
    propertyId: string,
    showAsButton?: boolean
}