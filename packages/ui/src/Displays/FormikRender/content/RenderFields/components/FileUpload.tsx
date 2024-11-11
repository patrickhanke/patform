import React from 'react';
import {getImageUrl, FileUploader} from '@repo/modules';
import { ImageField, Modal } from '@repo/ui';
import {useState} from 'react';

interface FileUploadProps {
    fieldValues: {
      name: string;
      value: string;
    };
    field: ImageField;
    setFieldValue: (name: string, value: any, shouldValidate?: boolean) => void;
	isHorizontal?: boolean;
  }
  
const FileUpload: React.FC<FileUploadProps> = ({ fieldValues, field, setFieldValue, isHorizontal }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [file, setFile] = useState('');

	return (
		<>
			<div className={isHorizontal ? 'form_horizontal_container' : ''}>
				<label htmlFor={fieldValues.name}>{field.label} </label>
				<button onClick={() => setIsOpen(true)}>
					{fieldValues.value ?
						<img src={getImageUrl({filePath: fieldValues.value, width: 60})} /> : 
						<div className='full_button primary sm'> Bild hochladen</div>
					}
				</button>
			</div>
			<Modal 
				isOpen={isOpen}
				cancelButtonHandler={() => setIsOpen(false)}
				confirmButtonHandler={() => {
					setFieldValue(field.name, file);
					setIsOpen(false);
				}}
				header={'Datei ändern'}
				buttonDisabled={[ false, !file]}
			>
				<FileUploader 
					onChange={imgUrl => setFile(imgUrl as string)}
					path={`${process.env.BYTESCALE_FILE_FOLDER}/files` as string}
					returnType={'string'}
					maxFileCount={1}
				/>
			</Modal>
		</>
	);

	
};

export default FileUpload;