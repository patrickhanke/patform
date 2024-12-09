import { TaskState } from '@/types';

const initial_task = {
	state: 'created' as TaskState,
	title: '',
	description: '',
	documents: [],
	assigned_staff: [],
	time: undefined,
	property: undefined,
	ticket: undefined
};

export default initial_task;