'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
import useGetTasks from './hooks/useGetTasks';
import { Filter } from '@/types';
import { useDataHandler } from '@/provider';
import { TasksComponent } from './types';
import SiteHeader from '@/_UI/surfaces/SiteHeader';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import SiteHeaderContent from './components/SiteHeaderContent';
import sortTasksForList from './functions/sortTasksForList';
import TaskList from './content/TaskList';
import { ContentElement } from './content/ContentElement';

const Tasks = ({id, className, siteType='active'}: TasksComponent) => {
	const [filters, setFilters] = React.useState([] as Filter[]);
	const {loading: updateLoading} = useDataHandler();

	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const {tasks, loading, refetch} = useGetTasks({id, className, filters, siteType});

	const initialFilters: () => Filter[] = useCallback(() => {
		if (siteType === 'active') {
			return([
				{key: 'state', value: ['assigned', 'created'], operator: '_in', id: 'state'}
			]);
		} else if (siteType === 'executed') {
			return([{key: 'state', value: 'executed', operator: '_eq', id: 'state'}]);
		} else if (siteType === 'closed') {
			return([{key: 'state', value: 'completed', operator: '_eq', id: 'state'}]);
		} else if (siteType === 'archived') {
			return([{key: 'state', value: 'archived', operator: '_eq', id: 'state'}]);
		}
		if (searchParams.get('task')) {
			return([{key: 'objectId', value: searchParams.get('task') as string, operator: '_eq', id: 'objectId'}]);
		}
		return [{key: 'state', value: ['assigned', 'created', 'executed', 'completed'], operator: '_in', id: 'state'}];
	}, [siteType, searchParams.get('ticket')]);

	const siteHeaderButtons = useMemo(() => [{
		type: 'button',
		text: 'Filter zurücksetzen',
		onClick: () => {
			if (searchParams.get('task')) {
				router.push(pathname);
			}
			setFilters(initialFilters());
		},
		color: 'secondary',
		is_reset_button: true,
		disabled: loading || updateLoading || filters.length === 0
	}], [loading, updateLoading]);

	useEffect(() => {
		setFilters(initialFilters());
	}, [siteType]);

	const siteHeaderContent = useMemo(() => (
		<SiteHeaderContent
			id={id}
			filters={filters}
			setFilters={setFilters}
			tasks={tasks || []}
			siteType={siteType}
		/>
	), [filters, siteType]);

	return (
		<>
			<SiteHeader 
				isSubHeader
				siteHeaderContent={siteHeaderContent}
				siteHeaderButtons={siteHeaderButtons}
				refetch={refetch}
			/>
			<div className='site_content'>
				{sortTasksForList(tasks || []).map(taskList => (
					<ContentElement key={taskList.title} title={taskList.title}>
						<TaskList taskList={taskList.data} refetch={refetch} />
					</ContentElement>
				))}
			</div>
		</>
	);
};

export default Tasks;