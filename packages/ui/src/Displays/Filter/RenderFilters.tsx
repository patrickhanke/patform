'use client';

import { useEffect, useMemo } from 'react';
import { RenderFiltersProps } from './types';
import {Filter} from '@repo/types';
import FilterSelect from './components/FilterSelect';
import createFilterFromCategory from './functions/createFilterFromCategory';

const RenderFilters = ({categories, filters, setFilters, initialFilters = []} : RenderFiltersProps) => {
	// useEffect(() => {
	// 	if (filters.length === 0) {
	// 		const categoryFilters = categories.map((category) => createFilterFromCategory(category));
	// 		setFilters([...categoryFilters, ...initialFilters]);
	// 	}
	// }, [categories]);
    
	const renderFilters = useMemo(() => {
		const filterArray: JSX.Element[] = [];
		filters.forEach((filter: Filter) => {
			const category = categories.find((category) => category.id === filter.id);
			if (category) {
				filterArray.push(
					<FilterSelect
						category={category}
						filter={filter}
						filters={filters}
						setFilters={setFilters}
					/>
				);
			}
		});
		return filterArray;
	}, [filters, setFilters, categories]);

	return (
		<div className='button_container'>
			{renderFilters}
		</div>
	);
};

export default RenderFilters;