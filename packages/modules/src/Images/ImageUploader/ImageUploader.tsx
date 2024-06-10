import { useMemo } from 'react';
import './styles.scss';
import { ErrorDisplay } from '@repo/ui';
import { UploadDropzone } from '@bytescale/upload-widget-react';
import {ImageDisplay, getImageUrl} from '../ImageDisplay';
import { v4 as uuidv4 } from 'uuid';
import { ImageUplaoderProps } from './types';

const ImageUploader = ({
	previewImages,
	onChange,
	label,
	path,
	maxFileCount
}: ImageUplaoderProps ) => {
	console.log(process.env.BYTESCALE_PUBLIC_KEY);
	console.log(path);
	
	const options  = useMemo(() => { 
		
		return ({
			apiKey: process.env.BYTESCALE_PUBLIC_KEY as string, 
			maxFileCount: maxFileCount || 10,
			showFinishButton: false, 
			filename: `${path}_${uuidv4()}`,

			path: {
				fileNameFallback: `image_${new Date()}.jpg`,
				fileNameVariablesEnabled: true,
				folderPath: `/CMS/${path}/images`,
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

	const renderPrevieImages =  useMemo(() => {
		if (previewImages && Array.isArray(previewImages)) {
			return( 
				<div className='image_uploader_display_container'>
					{previewImages.map((image, index) => (
						<img
							key={index}
							src={getImageUrl({filePath: image})}
						/>
					))}
				</div>
			);
		}
	
	}, []);

	return (
		<div className={'upload_container'}>
			<label htmlFor="logo">{label}</label>
			{renderPrevieImages && renderPrevieImages }
			<UploadDropzone
				options={options}
				onUpdate={( files ) => onChange(files?.uploadedFiles.map((file) => file.filePath)) as unknown as (F:  string[] ) => void }
				// onUpdate={files => console.log({files})}
				width="100%"
				height="fit-content"
				className={'upload_zone'}
			/>
			<ErrorDisplay id='uloader' errors={[]} />
		</div>
	);
};

export default ImageUploader;