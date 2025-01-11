import React from 'react';
import { uploadFile } from '@repo/provider';
import styles from './DocumentUploader.module.scss';
import { ErrorDisplay } from '@/_UI/surfaces';
import { ApplicationTypes } from '@types';

const DocumentUploader = ({
	name, 
	filename, 
	onChange,
	label
} : {
	name: string, 
	filename: string,
	onChange: (F: {url: string, name: string}) => void,
	label: string
}) => {
	return (
		<div className={styles.upload_container}>
			<label htmlFor="logo">{label}</label>
			<input
				className={styles.upload_button}
				type="file"
				id={name}
				name={name}
				accept=".doc, .pdf, .docx"
				onChange={async e => {
					if (e?.target?.files && e?.target?.files?.length > 0) {
						const file =  await uploadFile({file: e.target.files[0], filename});
						onChange(file);
					}
				}}
			/> 
			
			<ErrorDisplay id='uloader' errors={[]} />
		</div>
	);
};

export default DocumentUploader;