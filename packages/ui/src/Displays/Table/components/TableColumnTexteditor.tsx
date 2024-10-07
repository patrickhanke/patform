'use client';

import { TableColumnTextfieldProps } from '../types';
import {useState} from 'react';
import { IconButton } from '../../../Buttons';
import '../styles.scss';
import { Editor, Modal } from '@repo/ui';

const TableColumnTexteditor = ({value, isEditable = false, onChange }: TableColumnTextfieldProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [string, setString] = useState(value);

	return (
		<>
			<div className='table_column_textfield_container'>
				{value ? <div dangerouslySetInnerHTML={{__html: value}} /> : '-'}

				{isEditable && 
				<>
					{!isOpen ? 
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
				</>
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