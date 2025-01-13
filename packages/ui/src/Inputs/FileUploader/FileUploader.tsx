'use client';

import { useMemo, useState } from 'react';
import './styles.scss';
import { ErrorDisplay, Modal } from '@repo/ui';
import { UploadDropzone, UploadDropzoneConfig } from '@bytescale/upload-widget-react';
import { v4 as uuidv4 } from 'uuid';
import clsx from 'clsx';
import { FileUplaoderProps } from './types';
import './styles.scss';
import useRenderPreviewContent from './hooks/useRenderPreviewContent';
import { isArray } from 'lodash';

const FileUploader = ({
	type,
	value,
	onChange,
	label,
	path,
	maxFileCount,
	returnType='array',
	setSecondaryContent
}: FileUplaoderProps ) => {
	const renderPreviewContent = useRenderPreviewContent({type, value});
	const [files, setFiles] = useState<string[] | string>([]);
	const [uploadModal, setUploadModal] = useState(false);
	const options: UploadDropzoneConfig  = useMemo(() => { 
		return ({
			apiKey: process.env.BYTESCALE_PUBLIC_KEY as string, 
			maxFileCount: maxFileCount || 10,
			showFinishButton: false, 
			filename: `${path}_${uuidv4()}`,
			path: {
				fileNameFallback: type === 'image' ?  `image_${new Date()}` :  `file_${new Date()}`,
				fileNameVariablesEnabled: true,
				folderPath: type === 'image' ? `/patstore/${path}/images` : `/patstore/${path}/files`,
				folderPathVariablesEnabled: true
			},
			showRemoveButton: true,
			styles: {
				buttons: {
					padding: '10px',
					primary: {
						backgroundColor: '#3F9A82',
						color: '#fff'
					}
				},
				colors: {
					primary: '#3F9A82',
					active: '#2d3d38'
				}
			}
		});
	}, []);

	const renderDropzone = useMemo(() => { 
		return (
			<>
				{label && <label htmlFor="logo">{label}</label>}
				{renderPreviewContent }
				<UploadDropzone
					options={options}
					onUpdate={( files ) => {
						if (setSecondaryContent) {
							if (returnType === 'string' && files?.uploadedFiles.length > 0) {
								return onChange(files?.uploadedFiles.map((file) => file.filePath)[0] as string) as unknown as (F:  string ) => void;
							}
							return onChange(files?.uploadedFiles.map((file) => file.filePath)) as unknown as (F:  string[] ) => void; 
						} else {
							if (returnType === 'string' && files?.uploadedFiles.length > 0) {
								return setFiles(files?.uploadedFiles.map((file) => file.filePath)[0] as string) as unknown as (F:  string ) => void;
							} else {
								setFiles(files?.uploadedFiles.map((file) => file.filePath));
							}
							
						}
					}}
					// onUpdate={files => console.log({files})}

					width="100%"
					height="auto"
					className={clsx('upload_zone', maxFileCount === 1 && 'single_image')}
				/>
				<ErrorDisplay id='uloader' errors={[]} />
			</>
		);

	}, []);

	const text = useMemo(() => {
		if (isArray(value)) {
			return value.length > 1 ? `${value.length} Dateien` : '1 Datei';
		} else if (typeof value === 'string') {
			return '1 Datei';
		} 

		return 'Datei hochladen';
		
    
	}, [value]);

	return (
		<div className={'upload_container'}>
			<button 
				type='button' 
				className='edit_text'
				onClick={() => {
					if (setSecondaryContent) {
						return setSecondaryContent(renderDropzone);
					}
					setUploadModal(true);
				}}
			>
				{text}
			</button>
			{!setSecondaryContent && 
				<Modal 
					isOpen={uploadModal}
					cancelButtonHandler={ () => setUploadModal(false)}
					confirmButtonHandler={ () => {
						onChange(files);
						setUploadModal(false);
					}}
					header="Upload Image"
				>
					{renderDropzone}
				</Modal>
			}
		</div>
	);
};

export default FileUploader;