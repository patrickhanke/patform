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
					<button type='button' className='edit_text' onClick={() => setIsOpen(!isOpen)}>
						{value ? value : '-'}
					</button>
				}

				{isEditable &&  
					<>
						{isOpen &&
							<div className='button_container'>
								<IconButton
									icon='cancel'
									onClick={() => {
										setIsOpen(!isOpen);
										setString(value);
									}}
								/>
								<IconButton
									icon='check'
									onClick={() => {
										setIsOpen(!isOpen);
										onChange(string);
									}}
								/>
							</div>
						}
					</>
				}
			</div>
		</>
	);
};

export default TableColumnString;