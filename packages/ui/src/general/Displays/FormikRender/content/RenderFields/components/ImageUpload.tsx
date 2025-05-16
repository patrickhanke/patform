import React from "react";
import { PatstoreSelectImages } from "@repo/ui";
import { ImageField } from "@repo/ui";

interface ImageUploadProps {
	fieldValues: {
		name: string;
		value: string;
	};
	field: ImageField;
	setFieldValue: (
		name: string,
		value: string | string[],
		shouldValidate?: boolean
	) => void;
	isHorizontal?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
	fieldValues,
	field,
	setFieldValue
}) => {
	return (
		<>
			<PatstoreSelectImages
				image={fieldValues.value}
				onChange={(imgUrl: string) =>
					setFieldValue(field.name, imgUrl as string)
				}
				maxFileCount={field?.options?.max_file_count || 10}
			/>
		</>
	);
};

export default ImageUpload;
