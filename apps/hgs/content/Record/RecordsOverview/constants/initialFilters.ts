import { Filter } from '@types';

const initialFilters: (year?: number) => Filter[] = (year) => [
	{
		key: 'year',
		operator: '_eq',
		value:  year || new Date().getFullYear(),
		id: 'year'
	}
    
]; 

export default initialFilters;