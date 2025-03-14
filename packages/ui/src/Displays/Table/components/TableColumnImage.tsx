'use client';

import { AppContext, getImageUrl } from '@repo/provider';
import { TableColumnImageProps } from '../types';
import { Modal, IconButton } from '@repo/ui';
import {useContext, useState} from 'react';
import { ImageUploader } from '@repo/ui';
import '../styles.scss';

const TableColumnImage = ({ url, isEditable = false, onChange, maxFileCount }: TableColumnImageProps) => {
	const {currentModule} = useContext(AppContext);
	const [isOpen, setIsOpen] = useState(false);
	const [image, setImage] = useState('');
	
	return (
		<>
			<div className='horizontal_container'>
				<div className='table_columns_image_container'>
					{url ?
						<img src={getImageUrl({filePath: url, height: 30})} /> : <div className='table_columns_image_placeholder' />
					}
				</div>
				<div className='table_vertical_container'>
					{isEditable &&
						<IconButton icon='edit' onClick={() => setIsOpen(true)} />
					}
					{url && (
						<IconButton
							onClick={() => null}
							icon='download'
							isLink
							isBlank
							link={getImageUrl({filePath: url})}
						/>
					)}
				</div>
			</div>
			<Modal 
				isOpen={isOpen}
				cancelButtonHandler={() => setIsOpen(false)}
				confirmButtonHandler={() => {
					onChange(image);
					setIsOpen(false);
				}}
				header={'Bild ändern'}
				buttonDisabled={[ false, !image]}
			>
				<ImageUploader 
					label='Bild'
					onChange={imgUrl => setImage(imgUrl as string)}
					path={`${process.env.BYTESCALE_IMAGE_FOLDER}${currentModule.path}`}
					maxFileCount={maxFileCount}
				/>
			</Modal>
		</>
	);
};

export default TableColumnImage;