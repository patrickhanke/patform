import React, { useMemo } from 'react';
import mime from 'mime';
import styles from './FileDisplay.module.scss';
import { GrDocumentPdf } from 'react-icons/gr';
import { Document } from '@repo/types';

const FileDisplay = ({document}: {document: Document}) => {
	console.log(mime.getType(document.file.name));
	const renderFileIcon = useMemo(() => {  
		const fileType = mime.getType(document.file.name);
		if (fileType && fileType.includes('image')) {
			return <img src={document.file.url} alt={document.name} height={'21px'} />;
		} else if (fileType && fileType.includes('video')) {
			return <video src={document.file.url} controls  height={'21px'} />;
		} else if (fileType && fileType.includes('audio')) {
			return <audio src={document.file.url} controls />;
		} else {
			return <GrDocumentPdf height={'21px'} />;
		}
	}, [document]);

	return (
		<div className={styles.file_display_container}>{renderFileIcon}</div>
	);
};

export default FileDisplay;