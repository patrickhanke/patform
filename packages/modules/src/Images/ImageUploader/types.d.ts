export type UseImageDataHandlerProps = {
	projectId: string,
	afterSaveFunction?: Function,
	afterCancelFunction?: Function
}

export type ImageUplaoderProps = {
	previewImages?: string[],
	onChange: (F: string[] | string ) => void,
	label?: string,
	path: string,
	maxFileCount?: number;
	returnType?: 'array' | 'string'
}