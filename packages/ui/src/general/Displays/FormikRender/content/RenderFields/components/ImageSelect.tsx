import React from "react";
import { PatstoreSelectImages } from "@repo/ui";
import { ImageField } from "@repo/ui";

interface ImageSelectProps {
	fieldValues: {
		name: string;
		value: string;
	};
	field: ImageField;
	onChange: (value: string) => void;
}

const ImageSelect: React.FC<ImageSelectProps> = ({
	fieldValues,
	field,
	onChange
}) => {
	return (
		<>
			<PatstoreSelectImages
				image={fieldValues.value}
				onChange={(imgUrl: string) => onChange(imgUrl as string)}
				maxFileCount={field?.options?.max_file_count || 10}
			/>
		</>
	);
};

export default ImageSelect;
