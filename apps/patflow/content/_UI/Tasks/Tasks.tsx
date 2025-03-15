'use client';

import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import useGetTasks from './hooks/useGetTasks';
import { Filter } from '@types';
import { SiteType, TasksComponent } from './types';
import { useSearchParams } from 'next/navigation';
import SiteHeaderContent from './components/SiteHeaderContent';
import sortTasksForList from './functions/sortTasksForList';
import TaskList from './content/TaskList';
import { Divider, Page } from '@repo/ui';
import site_states from './constants/site_states';
import { AppContext } from '@provider';
import { NotificationContext } from '@repo/provider';

const Tasks = ({ id, className, pageState }: TasksComponent) => {
    const [filters, setFilters] = React.useState([] as Filter[]);
    const [siteState, setSiteState] = useState<(typeof site_states)[number]>(
        site_states[0] as (typeof site_states)[0]
    );
    const searchParams = useSearchParams();
    const { tasks, refetch } = useGetTasks({
        id,
        className,
        filters,
        siteType: siteState.value as SiteType,
    });
    const { refetchTask } = useContext(AppContext);
    const { newNotification } = useContext(NotificationContext);

    const initialFilters: () => Filter[] = useCallback(() => {
        const filterArray: Filter[] = [];
        if (pageState === 'active') {
            filterArray.push({
                key: 'state',
                value: ['assigned', 'created'],
                operator: '_in',
                id: 'state',
            });
        } else if (pageState === 'executed') {
            filterArray.push({
                key: 'state',
                value: 'executed',
                operator: '_eq',
                id: 'state',
            });
        } else if (pageState === 'completed') {
            filterArray.push({
                key: 'state',
                value: 'completed',
                operator: '_eq',
                id: 'state',
            });
        } else if (pageState === 'archived') {
            filterArray.push({
                key: 'state',
                value: 'archived',
                operator: '_eq',
                id: 'state',
            });
        }
        if (searchParams.get('task')) {
            filterArray.push({
                key: 'objectId',
                value: searchParams.get('task') as string,
                operator: '_eq',
                id: 'objectId',
            });
        }

        return filterArray;
    }, [pageState, searchParams.get('task')]);

    const siteContent = useMemo(() => {
        let content = {
            title: 'Aufgaben',
            description: '',
        };
        if (pageState === 'active') {
            content.title = 'Aktive Aufgaben';
            content.description =
                'Hier finden Sie alle Aufgaben, die noch nicht erledigt sind.';
        } else if (pageState === 'executed') {
            content.title = 'Ausgeführte Aufgaben';
            content.description = 'Hier finden Sie alle ausgeführten Aufgaben.';
        } else if (pageState === 'completed') {
            content.title = 'Erledigte Aufgaben';
            content.description = 'Hier finden Sie alle erledigten Aufgaben.';
        } else if (pageState === 'archived') {
            content.title = 'Archivierte Aufgaben';
            content.description = 'Hier finden Sie alle archivierten Aufgaben.';
        }

        return content;
    }, [pageState]);

    useEffect(() => {
        setFilters(initialFilters());
    }, [siteState]);

    useEffect(() => {
        if (refetchTask) {
            refetch();
        }
    }, [refetchTask]);

    useEffect(() => {
        if (newNotification) {
            refetch();
        }
    }, [newNotification]);

    if (id && className) {
        return (
            <>
                <SiteHeaderContent
                    id={id}
                    filters={filters}
                    setFilters={setFilters}
                    initialFilters={initialFilters}
                />
                <Divider
                    size="small"
                    showLine={false}
                />
                <TaskList
                    taskList={tasks || []}
                    refetch={refetch}
                    pageState={pageState}
                />
            </>
        );
    }

    const siteStates = useMemo(() => {
        return site_states.map(state => ({
            ...state,
            label: `${state.label} (${sortTasksForList(tasks || []).find(taskList => taskList.value === state.value)?.data.length || '0'})`,
            count: tasks?.filter(task => task.state === state.value).length,
        }));
    }, [tasks]);

    return (
        <Page
            title={siteContent.title}
            description={siteContent.description}
            refetch={refetch}
            pageStates={pageState === 'active' ? siteStates : undefined}
            pageState={siteState}
            setPageState={setSiteState}
        >
            <SiteHeaderContent
                id={id}
                filters={filters}
                setFilters={setFilters}
                initialFilters={initialFilters}
            />
            <Divider
                size="small"
                showLine={false}
            />
            {pageState !== 'active' ? (
                <TaskList
                    taskList={tasks || []}
                    refetch={refetch}
                    pageState={pageState}
                />
            ) : (
                <TaskList
                    taskList={
                        sortTasksForList(tasks || []).find(
                            taskList => taskList.value === siteState.value
                        )?.data || []
                    }
                    refetch={refetch}
                    pageState={pageState}
                />
            )}
        </Page>
    );
};

export default Tasks;
