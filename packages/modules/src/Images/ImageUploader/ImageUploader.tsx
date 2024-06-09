import React, { useMemo } from 'react';
import './styles.scss';
import {Image} from '@repo/types'
import { ErrorDisplay } from '@repo/ui';
import { UploadDropzone } from '@bytescale/upload-widget-react';
import {ImageDisplay} from '../ImageDisplay';

const ImageUploader = ({
	filename, 
	previewImage,
	onChange,
	label,
	path,
	maxFileCount
} : {
	filename: string,
	previewImage?: Image | Image[],
	onChange: (F: Image[] ) => void,
	label: string,
	path: string,
	maxFileCount?: number
}) => {
	const options  = useMemo(() => { 
		
		return ({
			apiKey: process.env.BYTESCALE_PUBLIC_KEY as string, // This is your API key.
			maxFileCount: maxFileCount || 10,
			showFinishButton: true, // Note: You must use 'onUpdate' if you set 'showFinishButton: false' (default).
			filename: filename,
			path: {
				fileNameFallback: `image_${new Date()}.jpg`,
				fileNameVariablesEnabled: true,
				folderPath: `/HGS/${path}`,
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

	const previewImages =  useMemo(() => {
		if (previewImage) {
			if (Array.isArray(previewImage)) {
				return( 
					<div className='image_uploader_display_container'>
						{previewImage.map((image, index) => (
							<ImageDisplay
								key={index}
								image={image}
							/>
						))}
					</div>
				);
			}
			return <ImageDisplay image={previewImage} />;
		}
	
	}, []);

	return (
		<div className={'upload_container'}>
			<label htmlFor="logo">{label}</label>
			{previewImage && previewImages }
			<UploadDropzone
				options={options}
				onComplete={( uploadedFiles ) => onChange(uploadedFiles.map((file) => file.filePath)) as unknown as (F:  Image[] ) => void }
				onUpdate={files => console.log({files})}
				width="100%"
				height="fit-content"
				className={'upload_zone'}
			/>
			<ErrorDisplay id='uloader' errors={[]} />
		</div>
	);
};

export default ImageUploader;