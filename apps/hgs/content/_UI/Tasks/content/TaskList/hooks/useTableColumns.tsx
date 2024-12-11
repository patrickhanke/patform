import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Task } from '@/types';
import TaskTitle from '../components/TaskTitle';
import TaskNextDate from '../content/TaskNextDate';
import DisplayProperty from '../content/DisplayPropery';
import DisplayTaskState from '../content/DisplayTaskState';
import TeamAssignments from '../content/TeamAssignment';
import TaskSlideIn from '../content/TaskSlideIn';
import { UseTaskColumnsProps } from '../types';

const useTableColumns = ({refetch, setArchiveModal, setDeleteTaskModal}: UseTaskColumnsProps) => { 
	console.log('columns');
	
	
	const columns: ColumnDef<Task>[] = useMemo(() => [
		{
			accessorFn: (task) => (
				<TaskTitle
					taskId={task.objectId}
					taskTitle={task.title}
					refetch={refetch}
					taskState={task.state}
				/>
			),
			header: () => <span>Titel</span>,
			id: 'title',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorFn: (task) => (
				<TaskNextDate
					taskId={task.objectId} 
					tasksRefetch={refetch} 
					setArchiveModal={setArchiveModal} 
					setDeleteTaskModal={setDeleteTaskModal}
				/>
			),
			header: () => <span>Termin</span>,
			id: 'start_time',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorFn: task => <DisplayProperty taskId={task.objectId} />,
			header: () => <span>Objekt</span>,
			id: 'property',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorFn: task => <DisplayTaskState taskId={task.objectId} taskState={task.state} />,
			header: () => <span>Status</span>,
			id: 'state',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorFn: task => (
				<TeamAssignments
					taskId={task.objectId}
					refetchTask={refetch}
					taskState={task.state}
					showAsButton
					selectWorkers={task.state === 'created' || task.state === 'assigned'}
				/>
			),
			header: () => <span>Zugewiesen an</span>,
			id: 'absence_days',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorFn: task => <TaskSlideIn title={task.title} taskId={task.objectId} />,
			header: () => <span>Info</span>,
			id: 'info',
			cell: info => info.getValue(),
			footer: info => info.column.id
		}
	], []);

	return columns;
};

export default useTableColumns;