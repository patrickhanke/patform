'use client';

import { useEffect, useMemo } from 'react';
import { RenderFiltersProps } from './types';
import { CategoryClass, Filter, Category } from '@repo/types';
import FilterSelect from './components/FilterSelect';
import createFilterFromCategory from './functions/createFilterFromCategory';

const RenderFilters = ({categories, filters = [], setFilters, initialFilters = []} : RenderFiltersProps) => {
	// useEffect(() => {
	// 	if (filters.length === 0) {
	// 		const categoryFilters = categories.map((category) => createFilterFromCategory(category));
	// 		setFilters([...categoryFilters, ...initialFilters]);
	// 	}
	// }, [categories]);
	
    
	const renderFilters = useMemo(() => {
		const filterArray: JSX.Element[] = [];
		categories.forEach((category: Category) => {
			console.log(category);
			
			if (category) {
				filterArray.push(
					<FilterSelect
						category={category}
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
			<button onClick={() => setFilters(initialFilters)}>
				Filter zurücksetzen
			</button>
		</div>
	);
};

export default RenderFilters;