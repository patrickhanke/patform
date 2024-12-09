import Modal from '@/_UI/interfaces/Modal';
import { UserContext } from '@/provider';
import { ApplicationTypes, ProperyDocuments } from '@/types';
import React, { useContext, useState } from 'react';
import styles from '../ProperyDocument.module.scss';
import { DocumentUploader, TextInput } from '@/content/_UI';

const CreateDocument = ({open, setOpen, createDocumentHandler}:  ProperyDocuments.CreateDocumentComponent ) => {
	const {user} = useContext(UserContext);
	const [name, setName] = useState('');
	const [file, setFile] = useState(null as unknown as ApplicationTypes.Document['file']);

	return (
		<Modal
			cancelButtonHandler={() => setOpen(false)}
			confirmButtonHandler={() => {
				createDocumentHandler({
					user: user.objectId,
					name: name,
					file: file
				});
				setName('');
				setFile(undefined as unknown as ApplicationTypes.Document['file'] );
			}}
			isOpen={open}
			header='Neues Dokument hochladen'
		>
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
			</div> 
		</Modal>
	);
};

export default CreateDocument;