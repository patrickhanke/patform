import { TaskState } from './Task';

export type TeamAssignmentsProps = {
    taskId: string,
    taskState?: TaskState,
    refetchTask: () => void,
    showAsButton?: boolean,
    selectWorkers?: boolean

}

export type DisplayWorkersProps = {
    taskId: string,
    taskState?: TaskState,
    refetchTask: () => void,
    showAsButton?: boolean,
    selectWorkers?: boolean
}