import { Dispatch, SetStateAction } from 'react';
import { Filter, ModuleCategory } from '@repo/types';

export type RenderFiltersProps = {
    categories: ModuleCategory[];
    filters: Filter[];
    initialFilters: Filter[];
    setFilters: Dispatch<SetStateAction<Filter[]>>;
}

export type FilterSelectProps = {
    category: ModuleCategory;
    filter: Filter;
    filters: Filter[];
    setFilters: Dispatch<SetStateAction<Filter[]>>;
}