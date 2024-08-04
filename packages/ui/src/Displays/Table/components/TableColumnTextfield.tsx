'use client';

import { TableColumnTextfieldProps } from '../types';
import {useState} from 'react';
import { IconButton } from '../../../Buttons';
import '../styles.scss';
import { Modal } from '../../../Overlays';

const TableColumnTextfield = ({value, isEditable = false, onChange }: TableColumnTextfieldProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [string, setString] = useState(value);

	return (
		<>
			<div className='table_column_textfield_container'>
				{value ? value : '-'}

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
			<Modal 
				isOpen={isOpen}
				cancelButtonHandler={() => setIsOpen(false)}
				confirmButtonHandler={() => {
					onChange(string);
					setIsOpen(false);
				}}
				header={'Beschreibung ändern'}
				buttonDisabled={[ false, !string]}
			>
				<div className={'table_column_textfield_textarea_container'} >
					<textarea
						defaultValue={value}
						onChange={e => setString(e.target.value)}

					/>
				</div>
			</Modal>
		</>
	);
};

export default TableColumnTextfield;