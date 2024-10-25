'use client';

import { AppContext, getImageUrl } from '@repo/provider';
import { TableColumnGalleryProps } from '../types';
import { Modal, IconButton } from '@repo/ui';
import {useContext, useState} from 'react';
import { ImageUploader } from '@repo/modules';
import '../styles.scss';
import { isArray } from 'lodash';

const TableColumnGallery = ({ value = [], onChange, maxFileCount = 0 }: TableColumnGalleryProps) => {
	const {currentModule} = useContext(AppContext);
	const [isOpen, setIsOpen] = useState(false);
	const [image, setImage] = useState<string[]>([]);
	
	return (
		<>
			<div className='button_container'>
				<p style={{whiteSpace: 'no-wrap'}}>
					{isArray(value) ? value?.length : '0'} Bilder
				</p>
				<IconButton icon='edit' onClick={() => setIsOpen(!isOpen)} />
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
					onChange={imgUrl => setImage(imgUrl as string[])}
					path={`${process.env.BYTESCALE_IMAGE_FOLDER}${currentModule.path}`}
					returnType='array'
					maxFileCount={maxFileCount}
				/>
				{isArray(value) && value.length > 0 && 
                    <div>
                    	<label>Bilder</label>
                    	{value.map((url: string) => (
                    		<div key={url}>
                    			<img src={getImageUrl({filePath: url, width: 240})} />
                    		</div>
                    	))}
                    </div>   
				}
			</Modal>
		</>
	);
};

export default TableColumnGallery;