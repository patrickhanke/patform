'use client';

import { useMemo } from 'react';
import { RenderFiltersProps } from './types';
import { ModuleCategory } from '@repo/types';
import FilterSelect from './components/FilterSelect';

const RenderFilters = ({categories, filters = [], setFilters, initialFilters = []} : RenderFiltersProps) => {
  
	const renderFilters = useMemo(() => {
		const filterArray: JSX.Element[] = [];
		categories.forEach((category: ModuleCategory) => {
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
			<button className='full_button primary md' onClick={() => setFilters(initialFilters)}>
				<span>Filter zurücksetzen</span>
			</button>
		</div>
	);
};

export default RenderFilters;