'use client';

import { generateGraphQLQuery, useDataHandler } from '@repo/provider';
import { TableColumnCategoryProps } from '../types';
import '../styles.scss';
import {useCallback, useMemo} from 'react';
import { useQuery } from '@apollo/client';
import { Select } from '@repo/ui';
import { SelectOption } from '@repo/types';

const TableColumnCategory = ({ category, className, objectId, categories }: TableColumnCategoryProps) => {
	const {updateData} = useDataHandler();    
	const categoryChangeHandler = useCallback(async (value: string[]) => {
		const categoriesCopy = {...categories};
		categoriesCopy[category.moduleId as string] = value;
		await updateData({
			objectId: objectId,
			className,
			updateObject: {
				categories: categoriesCopy
			}
		});
	} , [category]);

    
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
		if (data) {
			const dataFields = data.objects[`find${category.connected_class}`].results;	
			dataFields.forEach((field: {objectId: string, [key: string]: string}) => {
				options.push( {
					value: field.objectId,
					label: field[category.key] as string
				});
			});
		}

		return options;
	} , [category, data]);

	return (
		<>
			<div className='button_container'>
				<Select
					onChange={(options: SelectOption[]) => {
						console.log(options);
						
						categoryChangeHandler(options.map((option: SelectOption) => option.value ));
					}}
					options={selectOptions}
					isMulti={category.is_multi}
				/>
			</div>
			
		</>
	);
};

export default TableColumnCategory;