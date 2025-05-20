import { ImageClass } from "@repo/types";

export type PatstoreSelectImagesProps = {
	image: string | string[] | undefined;
	onChange: (F: Image[] | Image) => void | Promise<void>;
	maxFileCount: number;
	previewImageSize?: "sm" | "md" | "lg" | "xl";
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
	previewImageSize: PatstoreSelectImagesProps["previewImageSize"];
};

export type UseGetImage = (T: { id: string }) => {
	image: ImageClass;
	filePath: string;
	loading: boolean;
	error: Error | undefined;
};

export type PatstoreImageDisplayProps = {
	id: string;
	height: number;
	width: number;
};
