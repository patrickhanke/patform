'use client';

import { generateGraphQLQuery } from '@repo/provider';
import { TableColumnCategoryProps } from '../types';
import '../styles.scss';
import {useMemo} from 'react';
import { useQuery } from '@apollo/client';
import { Select } from '@repo/ui';

const TableColumnCategory = ({ category, onChange }: TableColumnCategoryProps) => {
	console.log(category);
    
    
    const {data} = useQuery(generateGraphQLQuery(
		{
			type: 'find', 
			objectName: category.connected_class, 
			fields: ['objectId', category.key]
		}
	), {
		variables: {module: {_eq: category.moduleId}}
	});

    console.log(data);
	const selectOptions = useMemo(() => {
		const options: {value: string, label: string}[] = [];
		if (data) {
            
			const dataFields = data.objects[`find${category.connected_class}`].results;	
			dataFields.forEach((field: any) => {
				options.push( {
					value: field.objectId,
					label: field[category.key]
				});
			});
		}

		return options;
	} , [category, data]);

	return (
		<>
			<div className='button_container'>
				<Select
                    onChange={(value: any) => console.log(value)}
                    options={selectOptions}
                    isMulti={category.is_multi}
                />
			</div>
			
		</>
	);
};

export default TableColumnCategory;