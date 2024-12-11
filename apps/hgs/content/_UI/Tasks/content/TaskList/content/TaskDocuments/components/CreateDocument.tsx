import { UserContext } from '@/provider';
import React, { useContext, useState } from 'react';
import styles from '../TaskDocuments.module.scss';
import clsx from 'clsx';
import { DocumentUploader } from '@/content/_UI';
import { Document } from '@/types';
import { TextInput } from '@repo/ui';

const CreateDocument = ({addDocumentHandler, disabled = false}: {disabled: boolean, addDocumentHandler: (content: {user: string, file: Document['file'], name: string}) => void}) => {
	const {user} = useContext(UserContext);
	const [name, setName] = useState('');
	const [file, setFile] = useState(null as unknown as Document['file']);

	return ( 
		<div className={styles.create_document_container}>
			<DocumentUploader
				label='Neues Dokument'
				name='upload'
				filename='123'
				onChange={(value) => setFile(value)}
			/>
			<TextInput
				defaultValue={name}
				label='Name des Dokuments'
				id='document'
				onChange={value => setName(value)}
				width='100%'
			/>
			<div className='button_container'>
				<button 
					className={clsx('full_button', 'sm', 'dark')}
					disabled={disabled || !file || !name}
					onClick={() => {
						addDocumentHandler({
							user: user.objectId,
							name: name,
							file: file
						});
						setName('');
						setFile(undefined as unknown as Document['file'] );

					}}
				>
                    Dokument hinzufügen
				</button>
				<button 
					className={clsx('full_button', 'sm', 'light')}
					onClick={() => {
						setName('');
						setFile(null as unknown as Document['file']);
					}}
				>
                    Abbrechen
				</button>
			</div>
		</div> 
	);
};

export default CreateDocument;