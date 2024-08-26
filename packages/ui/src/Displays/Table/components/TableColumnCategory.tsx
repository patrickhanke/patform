'use client';

import { generateGraphQLQuery, useDataHandler } from '@repo/provider';
import { TableColumnCategoryProps } from '../types';
import '../styles.scss';
import { useCallback, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { Select } from '@repo/ui';
import { SelectOption } from '@repo/types';
import { cloneDeep, pull, merge } from 'lodash';

const TableColumnCategory = ({ category, className, objectId, categories = [], refetch }: TableColumnCategoryProps) => {
	const {updateData} = useDataHandler();  
	  
	const {data} = useQuery(generateGraphQLQuery(
		{
			type: 'find', 
			objectName: category.connected_class, 
			fields: ['objectId', category.key]
		}
	), {
		variables: {module: {_eq: category.moduleId}}
	});

	const selectOptions = useMemo(() => {
		const options: {value: string, label: string}[] = [];
		const values: string[] = [];
		if (data) {
			const dataFields = data.objects[`find${category.connected_class}`].results;	
			dataFields.forEach((field: {objectId: string, [key: string]: string}) => {
				options.push( {
					value: field.objectId,
					label: field[category.key] as string
				});
			});
		}

		if (options.length > 0) {
			options.forEach((option) => {
				if (categories.includes(option.value)) {
					values.push(option.value);
				}
			});
		}

		return ({
			options,
			values
		});
	} , [category, data]);

	const categoryChangeHandler = useCallback(async (value: string[]) => {
		const categoriesCopy = cloneDeep(categories);

		selectOptions.options.forEach((option) => {
			if (categories.includes(option.value)) {
				pull(categoriesCopy, option.value);
			}
		} );

		const updateCategoriesArray = merge(categoriesCopy, value);
		
		categoriesCopy.concat(value);
		await updateData({
			objectId: objectId,
			className,
			updateObject: {
				categories: updateCategoriesArray
			}
		});

		refetch();
	} , [category]);

	return (
		<>
			<div className='button_container'>
				<Select
					value={selectOptions.values}
					onChange={(options: SelectOption[]) => {
						categoryChangeHandler(options.map((option: SelectOption) => option.value ));
					}}
					options={selectOptions.options}
					isMulti={category.is_multi}
				/>
			</div>
			
		</>
	);
};

export default TableColumnCategory;