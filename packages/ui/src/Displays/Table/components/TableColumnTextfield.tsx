'use client';

import { TableColumnTextfieldProps } from '../types';
import {useState} from 'react';
import { IconButton } from '../../../Buttons';
import '../styles.scss';

const TableColumnTextfield = ({value, isEditable, onChange }: TableColumnTextfieldProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [string, setString] = useState('');

	return (
		<>
			<div className='table_column_textfield_container'>
				{isOpen ? 
					<div className='table_column_textfield_textarea_container'>
						<textarea
							defaultValue={value}
							onChange={e => setString(e.target.value)}
							onBlur={() => setIsOpen(!isOpen)}
						/>
					</div>
					: 
					value ? value : '-'
				}

				{isEditable && isOpen ? 
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

export default TableColumnTextfield;