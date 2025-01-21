'use client';

import { useState } from 'react';
import { ImageDisplayProps } from './types';
import { IconButton } from '@repo/ui';
import deleteImage from './functions/deleteImage';
import './styles.scss';
import { Image } from '@repo/types';
import getImageUrl from './functions/getImageUrl';

const ImageDisplay = ({image, deleteHandler}: ImageDisplayProps) => {
	const [showDelete, setShowDelete] = useState(false);
	const [loading, setLoading] = useState(false);

	const imageDeleteHandler = (image: Image) => {
		setLoading(true);
		deleteImage({
			accountId: process.env.BYTESCALE_ACCOUNT_ID as string,
			apiKey: process.env.BYTESCALE_SECRET_KEY as string,
			filePath: image
          
		}).then(
			error => console.error(error)
		);
		if (deleteHandler) {
			deleteHandler(image);
		}
		setShowDelete(false);
		setLoading(false);
	};

	return (
		<div className={'image_container'}>
			{showDelete ? 
				<>
					<p>
						{!loading ?  'Sind sie Sicher, dass sie das Bild löschen möchten?' : 'lädt...'}
					</p>
					<div className='button_container'>
						<IconButton icon={'cancel'} disabled={loading} onClick={() => setShowDelete(false)} />
						<IconButton icon={'check'} disabled={loading} onClick={() => imageDeleteHandler(image)} />
					</div>
				</>
				:
				<>
					<div className="button_container">
						<img src={getImageUrl({filePath: image})} alt={image} />
						{/* <p>
							{image}
						</p> */}
					</div>
					<div>
						{deleteHandler && <IconButton icon={'delete'} onClick={() => setShowDelete(true)} />}
					</div>
				</>
			}
		</div>
	);
};

export default ImageDisplay;