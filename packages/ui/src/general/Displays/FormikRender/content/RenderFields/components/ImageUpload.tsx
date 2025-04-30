import React from "react";
import { ImageUploader } from "@repo/ui";
import { ImageField, Modal } from "@repo/ui";
import { useState } from "react";
import { getImageUrl } from "@repo/provider";

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
	setFieldValue,
	isHorizontal
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [image, setImage] = useState("");

	return (
		<>
			<div className={isHorizontal ? "form_horizontal_container" : ""}>
				{fieldValues.value && (
					<>
						<img
							src={getImageUrl({
								filePath: fieldValues.value,
								width: 60
							})}
						/>
						<br />
					</>
				)}
				<button
					className="full_button primary sm"
					onClick={() => setIsOpen(true)}
				>
					{fieldValues.value
						? "Neues Bild hochladen"
						: "Bild hochladen"}
				</button>
			</div>
			<Modal
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
			</Modal>
		</>
	);
};

export default ImageUpload;
