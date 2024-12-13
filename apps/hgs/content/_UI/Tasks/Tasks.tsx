'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useGetTasks from './hooks/useGetTasks';
import { Filter } from '@types';
import { useDataHandler } from '@provider';
import { SiteType, TasksComponent } from './types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import SiteHeaderContent from './components/SiteHeaderContent';
import sortTasksForList from './functions/sortTasksForList';
import TaskList from './content/TaskList';
import { ContentElement } from './content/ContentElement';
import { Page } from '@repo/ui';
import site_states from './constants/site_states';

const Tasks = ({id, className}: TasksComponent) => {
	const [filters, setFilters] = React.useState([] as Filter[]);
	const {loading: updateLoading} = useDataHandler();
	const [siteState, setSiteState] = useState<typeof site_states[number]>(site_states[0] as typeof site_states[0]);
	const searchParams = useSearchParams();


	const {tasks, loading, refetch} = useGetTasks({id, className, filters, siteType: siteState.value as SiteType});

	const initialFilters: () => Filter[] = useCallback(() => {
		if (siteState.value === 'active') {
			return([
				{key: 'state', value: ['assigned', 'created'], operator: '_in', id: 'state'}
			]);
		} else if (siteState.value === 'executed') {
			return([{key: 'state', value: 'executed', operator: '_eq', id: 'state'}]);
		} else if (siteState.value === 'closed') {
			return([{key: 'state', value: 'completed', operator: '_eq', id: 'state'}]);
		} else if (siteState.value === 'archived') {
			return([{key: 'state', value: 'archived', operator: '_eq', id: 'state'}]);
		}
		if (searchParams.get('task')) {
			return([{key: 'objectId', value: searchParams.get('task') as string, operator: '_eq', id: 'objectId'}]);
		}
		return [{key: 'state', value: ['assigned', 'created', 'executed', 'completed'], operator: '_in', id: 'state'}];
	}, [siteState, searchParams.get('ticket')]);

	

	useEffect(() => {
		setFilters(initialFilters());
	}, [siteState]);

	return (
		<Page 
			title='Aufgaben'
			refetch={refetch}
			pageStates={site_states}
			pageState={siteState}
			setPageState={setSiteState}
		>
			<SiteHeaderContent
				id={id}
				filters={filters}
				setFilters={setFilters}
				initialFilters={initialFilters}

			/>
			{sortTasksForList(tasks || []).map(taskList => (
				<ContentElement key={taskList.title} title={taskList.title}>
					<TaskList taskList={taskList.data} refetch={refetch} />
				</ContentElement>
			))}
		</Page>
	);
};

export default Tasks;