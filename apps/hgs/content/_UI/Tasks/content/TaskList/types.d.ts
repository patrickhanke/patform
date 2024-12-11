import { ApolloRefetch, Task } from '@types';
import { Dispatch, SetStateAction } from 'react';

export type TaskListComponent = {
    taskList: Task[],
    refetch: ApolloRefetch
}

export type UseTaskColumnsProps = {
    refetch: ApolloRefetch,
    setArchiveModal: Dispatch<SetStateAction<Task | undefined>>,
    setDeleteTaskModal: Dispatch<SetStateAction<Task | undefined>>
}