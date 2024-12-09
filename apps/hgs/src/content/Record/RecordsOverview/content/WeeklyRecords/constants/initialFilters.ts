import { ApplicationTypes } from '@/types';

const initialFilters: ApplicationTypes.Filter[] = [
	{
		key: 'year',
		operator: '_eq',
		value: new Date().getFullYear(),
		id: 'year'
	}
    
]; 

export default initialFilters;