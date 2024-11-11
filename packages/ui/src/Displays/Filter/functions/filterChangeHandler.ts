import { Filter } from '@repo/types';
import { set } from 'lodash';

const filterChangeHandler = (
	key: Filter['key'], 
	value: Filter['value'], 
	operator: Filter['operator'],
	filters: Filter[],
	id?: string) => {	
	const filterIndex = filters.findIndex(filter => filter.key === key);
	
	if (filterIndex === -1) {
		const filterCopy = [...filters];
		filterCopy.push({
			key,
			value,
			operator,
			id: id || key
		});
		return(filterCopy);
	} else if (value) {
		const filterCopy = [...filters];
		set(filterCopy, `[${filterIndex}]`, {
			key,
			value,
			operator,
			id: id || key
		});
		return(filterCopy);
	} else {
		const filterCopy = [...filters];
		filterCopy.splice(filterIndex, 1);
		return(filterCopy);
	}
};

export default filterChangeHandler;