'use client';

import { TableColumnStringProps } from '../types';
import {useState} from 'react';
import { IconButton } from '../../../Buttons';
import '../styles.scss';

const TableColumnString = ({value, isEditable = false, onChange }: TableColumnStringProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [string, setString] = useState(value);

	return (
		<>
			<div className='table_columns_string_container'>
				{isOpen ? 
					<input
						type='text'
						defaultValue={value}
						onChange={e => setString(e.target.value)}
					/> 
					: 
					value ? value : '-'
				}

				{isEditable && !isOpen ? 
					<IconButton icon='edit' onClick={() => setIsOpen(!isOpen)} />
					:
					<IconButton
						icon='check'
						onClick={() => {
							setIsOpen(!isOpen);
							onChange(string);
						}}
					/>

				}
			</div>
		</>
	);
};

export default TableColumnString;