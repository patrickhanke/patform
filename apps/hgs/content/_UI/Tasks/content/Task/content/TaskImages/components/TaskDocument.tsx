import { ApplicationTypes } from '@types';
import React from 'react';
import styles from '../TaskDocuments.module.scss';
import { FileDisplay, IconButton } from '@content';

const TaskDocument = ({document}: {document: ApplicationTypes.Document}) => {
	return (
		<div className='content_element'>
			<div className={styles.document_container}> 
				<div className={styles.document_title_container}> 
					<div>
						<FileDisplay document={document} />
					</div>
					<div>
						<h3>{document.name}</h3>
					</div>
				</div>
				<div>
					<IconButton
						icon='download'
						isBlank
						isLink
						link ={document.file.url}
					/>
				</div>
			</div>
		</div>
	);
};

export default TaskDocument;