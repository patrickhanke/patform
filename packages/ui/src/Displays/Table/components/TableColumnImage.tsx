'use client';

import { getImageUrl } from '@repo/provider';
import { TableColumnImageProps } from '../types';
import { Modal } from '../../../Overlays';
import {useState} from 'react';
import { ImageUploader } from '@repo/modules';
import { IconButton } from '../../../Buttons';
import '../styles.scss';

const TableColumnImage = ({ url, isEditable = false, onChange, maxFileCount }: TableColumnImageProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [image, setImage] = useState('');
	
	return (
		<>
			<div className='button_container'>
				{url ?
					<img src={getImageUrl({filePath: url, width: 60})} /> : <div className='table_columns_image_placeholder' />
				}
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
					path=''
					returnType='string'
					maxFileCount={maxFileCount}
				/>
			</Modal>
		</>
	);
};

export default TableColumnImage;