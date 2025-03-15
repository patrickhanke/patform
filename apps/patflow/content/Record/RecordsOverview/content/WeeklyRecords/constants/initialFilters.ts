import { Filter } from '@repo/types';

const initialFilters: Filter[] = [
    {
        key: 'year',
        operator: '_eq',
        value: new Date().getFullYear(),
        id: 'year',
    },
];

export default initialFilters;
