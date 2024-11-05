'use client';

import { TableColumnTextfieldProps } from '../types';
import {useState} from 'react';
import '../styles.scss';
import { Editor, Modal } from '@repo/ui';
import {convert} from 'html-to-text';

const TableColumnTexteditor = ({value, onChange }: TableColumnTextfieldProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [string, setString] = useState(value);

	return (
		<>
			<div className='table_column_textfield_container'>
				<button 
					className='edit_text'
					type='button'
					onClick={() => setIsOpen(!isOpen)}
				> 
					{value && value.length > 0 ? convert(value).trim().split(/\s+/).length : '-'} Wörter
				</button>
			</div>
			<Modal 
				isOpen={isOpen}
				cancelButtonHandler={() => setIsOpen(false)}
				confirmButtonHandler={() => {
					onChange(string);
					setIsOpen(false);
				}}
				header={'Text'}
				buttonDisabled={[ false, !string]}
			>
				<div className={'table_column_textfield_textarea_container'} >
					<Editor 
						content={string}
						onChange={newValue => setString(newValue)}
					/>
				</div>
			</Modal>
		</>
	);
};

export default TableColumnTexteditor;