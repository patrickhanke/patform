'use client';

import { useCallback, useState } from 'react';
import { ImageDisplayProps } from './types';
import { IconButton } from '@repo/ui';
import deleteImage from './functions/deleteImage';
import * as Bytescale from '@bytescale/sdk';
import './styles.scss';
import { Image } from '@repo/types';

const ImageDisplay = ({image, deleteHandler}: ImageDisplayProps) => {
	const [showDelete, setShowDelete] = useState(false);
	const [loading, setLoading] = useState(false);

	const imageDeleteHandler = (image: Image) => {
		setLoading(true);
		deleteImage({
			accountId: process.env.BYTESCALE_ACCOUNT_ID as string,
			apiKey: process.env.BYTESCALE_SECRET_KEY as string,
			querystring: {
				filePath: image
			}
          
		}).then(
			error => console.error(error)
		);
		if (deleteHandler) {
			deleteHandler(image);
		}
		setShowDelete(false);
		setLoading(false);
	};

	const getImageUrl = useCallback(() =>{
		const url = Bytescale.UrlBuilder.url({
			accountId: process.env.BYTESCALE_ACCOUNT_ID as string,
			filePath: image,
			options: {
				transformation: 'image',
				transformationParams: {
					'w': 80,
					'h': 45
				}
			}
		});

		return url;

	}, [image]);

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
						<img src={getImageUrl()} alt={image} />
						<p>
							{image}
						</p>
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