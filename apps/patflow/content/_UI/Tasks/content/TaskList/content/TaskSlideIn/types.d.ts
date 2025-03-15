import { Task } from '@types';
import { Dispatch, SetStateAction } from 'react';

export type TaskSlideInProps = {
    title: string;
    taskId: string;
    setDeleteTaskModal: Dispatch<SetStateAction<Tasksk | undefined>>;
    setArchiveModal: Dispatch<SetStateAction<Task | undefined>>;
};
