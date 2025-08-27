export type UseFileDataHandlerProps = {
	projectId: string;
	afterSaveFunction?: () => void;
	afterCancelFunction?: () => void;
};

type FileUploadType = "image" | "file";
type FileUploadValue = string[] | string;

export type FileUplaoderProps = {
	type: FileUploadType;
	name?: string;
	onComplete?: () => void | Promise<void>;
	afterUploadHandler?: (images: string[]) => void | Promise<void>;
	maxFileCount?: number;
	className: "Download" | "Image";
	classKey: string;
	classId?: string;
	setSecondaryContent?: Dispatch<SetStateAction<ReactNode>> | undefined;
	existingFiles?: number;
	inline?: boolean;
};

export type UseRenderPreviewContentHook = ({
	type: FileUploadType,
	value: FileUploadValue
}) => React.ReactNode | null;

export type UploadFileProps = {
	modules: Module[];
};
