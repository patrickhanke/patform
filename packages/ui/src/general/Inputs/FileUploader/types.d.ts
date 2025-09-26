type FileUploadType = "image" | "file";
type FileUploadValue = string[] | string;
type FileObject = {
	name: string;
	url: string;
};

export type FileUplaoderProps = {
	type: FileUploadType;
	name?: string;
	onComplete?: () => void;
	afterUploadHandler?: (images: string[]) => void | Promise<void>;
	maxFileCount?: number;
	className: "Download" | "Image";
	classKey: string;
	classId?: string;
	setSecondaryContent?: Dispatch<SetStateAction<ReactNode>> | undefined;
	existingFile?: FileObject;
	inline?: boolean;
};

export type UplaoderProps = {
	type?: "image" | "file";
	afterUploadHandler?: (images: string[]) => void | Promise<void>;
	className: "Download" | "Image";
	classKey: string;
	classId?: string;
};

export type UseRenderPreviewContentHook = ({
	type: FileUploadType,
	value: FileUploadValue
}) => React.ReactNode | null;

export type UploadFileProps = {
	modules: Module[];
};
