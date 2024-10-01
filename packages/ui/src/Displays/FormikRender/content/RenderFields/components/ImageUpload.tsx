import React from 'react';
import {ImageUploader} from '@repo/modules';
import { Field } from '../../../types';

interface ImageUploadProps {
    fieldValues: {
      name: string;
      value: string;
    };
    field: Field;
    setFieldValue: (name: string, value: any, shouldValidate?: boolean) => void;
	isHorizontal?: boolean;
  }
  
const ImageUpload: React.FC<ImageUploadProps> = ({ fieldValues, field, setFieldValue, isHorizontal }) => {
    
	return (
		
			<ImageUploader 
				onChange={value => setFieldValue(field.name, value)}
				path={process.env.BYTESCALE_IMAGE_FOLDER as string}
				returnType={field?.options?.return_type || 'array'}
				maxFileCount={field?.options?.max_file_count || 10}
			/>
	);
};

export default ImageUpload;