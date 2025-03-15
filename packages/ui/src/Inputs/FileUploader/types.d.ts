export type UseFileDataHandlerProps = {
  projectId: string;
  afterSaveFunction?: () => void;
  afterCancelFunction?: () => void;
};

type FileUploadType = "image" | "file";
type FileUploadValue = string[] | string;

export type FileUplaoderProps = {
  type: FileUploadType;
  value?: FileUploadValue;
  onChange: (F: string[] | string) => void;
  label?: string;
  path: string;
  maxFileCount?: number;
  returnType?: "array" | "string";
  setSecondaryContent?: Dispatch<SetStateAction<ReactNode>> | undefined;
};

export type UseRenderPreviewContentHook = ({
  type: FileUploadType,
  value: FileUploadValue,
}) => React.ReactNode | null;
