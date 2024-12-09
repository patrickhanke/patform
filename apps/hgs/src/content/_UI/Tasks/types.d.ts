import { ApplicationTypes } from '@/types';

export type ViewState = {
	value: 'extended' | 'compact', 
	label: string,
	is_icon: boolean
};

export type TaskSection = {
    title: string;
    date: string;
    data: DataTypes.Task[];
  }[];

export type TasksComponent = {
    id?: string,
    className?: string,
    siteType?: 'active' | 'closed' | 'archived' | 'executed',
}

export type useGetTasksHook = {
    id?: string,
    className?: string,
    filters: ApplicationTypes.Filter[],
    siteType: TasksComponent['siteType']
}

export type SiteHeaderContentComponent = {
    id?: string,
    filters: ApplicationTypes.Filter[],
    setFilters: React.Dispatch<React.SetStateAction<ApplicationTypes.Filter[]>>,
    tasks: ApplicationTypes.Task[],
    siteType: TasksComponent['siteType']
}

export type useInitialFiltersHook = {
    siteType: TasksComponent['siteType']
}