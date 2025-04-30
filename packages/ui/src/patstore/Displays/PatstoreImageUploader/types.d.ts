export type PatstoreSelectImagesProps = {
	image: string | string[] | undefined;
	onChange: (F: Image[] | Image) => void;
	maxFileCount: number;
};

export type ImageUploaderProps = {
	previewImage?: Image | Image[];
	onChange: (F: Image[] | Image) => void;
	label: string;
	maxFileCount?: number;
	filename?: string;
	deleteHandler?: (image: Image) => void;
	crop?: boolean;
	preview?: boolean;
	returnType?: "array" | "string";
};

export type RenderButtonsProps = {
	selectedImages: string[];
	maxFileCount: number;
	onClick: Dispatch<SetStateAction<boolean>>;
	selectImages: boolean;
};
