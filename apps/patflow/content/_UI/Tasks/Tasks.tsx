'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useGetTasks from './hooks/useGetTasks';
import { Filter } from '@types';
import { SiteType, TasksComponent } from './types';
import { useSearchParams } from 'next/navigation';
import SiteHeaderContent from './components/SiteHeaderContent';
import sortTasksForList from './functions/sortTasksForList';
import TaskList from './content/TaskList';
import { Divider, Page } from '@repo/ui';
import site_states from './constants/site_states';

const Tasks = ({id, className, pageState}: TasksComponent) => {
	const [filters, setFilters] = React.useState([] as Filter[]);
	const [siteState, setSiteState] = useState<typeof site_states[number]>(site_states[0] as typeof site_states[0]);
	const searchParams = useSearchParams();
	const {tasks, refetch} = useGetTasks({id, className, filters, siteType: siteState.value as SiteType});

	const initialFilters: () => Filter[] = useCallback(() => {
		if (pageState === 'active') {
			return([
				{key: 'state', value: ['assigned', 'created'], operator: '_in', id: 'state'}
			]);
		} else if (pageState === 'executed') {
			return([{key: 'state', value: 'executed', operator: '_eq', id: 'state'}]);
		} else if (pageState === 'completed') {
			return([{key: 'state', value: 'completed', operator: '_eq', id: 'state'}]);
		} else if (pageState === 'archived') {
			return([{key: 'state', value: 'archived', operator: '_eq', id: 'state'}]);
		}
		if (searchParams.get('task')) {
			return([{key: 'objectId', value: searchParams.get('task') as string, operator: '_eq', id: 'objectId'}]);
		}
		return [{key: 'state', value: ['assigned', 'created', 'executed', 'completed'], operator: '_in', id: 'state'}];
	}, [pageState, searchParams.get('ticket')]);

	const siteContent = useMemo(() => {
		let content =  {
			title: 'Aufgaben',
			description: ''
		}
		if (pageState === 'active') {
			content.title =  'Aktive Aufgaben';
			content.description = 'Hier finden Sie alle Aufgaben, die noch nicht erledigt sind.';
		} else if (pageState === 'executed') {
			content.title =  'Ausgeführte Aufgaben';
			content.description = 'Hier finden Sie alle ausgeführten Aufgaben.';
		} else if (pageState === 'completed') {
			content.title =  'Erledigte Aufgaben';
			content.description = 'Hier finden Sie alle erledigten Aufgaben.';
		} else if (pageState === 'archived') {
			content.title =  'Archivierte Aufgaben';
			content.description = 'Hier finden Sie alle archivierten Aufgaben.';
		}

		return content;
	}, [pageState])

	useEffect(() => {
		setFilters(initialFilters());
	}, [siteState]);

	if (id && className) {
		return (
			<>
				<SiteHeaderContent
					id={id}
					filters={filters}
					setFilters={setFilters}
					initialFilters={initialFilters}
				/>
				{/* <SwitchButtons
					buttonStates={page_states}
					currentStates={page_states.find((state) => state.value === currentPage) as typeof page_states[number]}
					changeHandler={(state: SwitchButton) => {
						setCurrentPage(state.value);
					}}

				/> */}
				<Divider size='small' showLine={false} />
				<TaskList 
					taskList={tasks || []} 
					refetch={refetch} 
				/>
			</>
		);
	}
		
	return (
		<Page 
			title={siteContent.title}
			description={siteContent.description}
			refetch={refetch}
			pageStates={pageState === 'active' ? site_states : undefined}
			pageState={siteState}
			setPageState={setSiteState}
		>
			<SiteHeaderContent
				id={id}
				filters={filters}
				setFilters={setFilters}
				initialFilters={initialFilters}
			/>
			<Divider size='small' showLine={false} />
				{pageState !== 'active' ? 
					<TaskList 
						taskList={tasks || []} 
						refetch={refetch} 
				/>
					: 
				<TaskList
					taskList={sortTasksForList(tasks || []).find((taskList) => taskList.value === siteState.value)?.data || []}	
					refetch={refetch}
				/>
			}
		</Page>
	);
};

export default Tasks;