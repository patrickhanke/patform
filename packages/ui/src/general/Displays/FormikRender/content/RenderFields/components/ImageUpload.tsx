import React from "react";
import { PatstoreSelectImages } from "@repo/ui";
import { ImageField } from "@repo/ui";

interface ImageUploadProps {
	fieldValues: {
		name: string;
		value: string;
	};
	field: ImageField;
	setFieldValue: (name: string, value: any, shouldValidate?: boolean) => void;
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
			{/* <Modal
				isOpen={isOpen}
				cancelButtonHandler={() => setIsOpen(false)}
				confirmButtonHandler={() => {
					setFieldValue(field.name, image);
					setIsOpen(false);
				}}
				header={"Bild ändern"}
				buttonDisabled={[false, !image]}
			>
				<ImageUploader
					label=""
					onChange={(imgUrl) => setImage(imgUrl as string)}
					returnType={field?.options?.return_type || "array"}
					maxFileCount={field?.options?.max_file_count || 10}
				/>
			</Modal> */}
		</>
	);
};

export default ImageUpload;
