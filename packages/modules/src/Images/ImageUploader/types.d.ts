export type UseImageDataHandler = (
    afterSaveFunction?: Function, 
    afterCancelFunction?: Function
) => ({
    imageUploadHandler: (images: string[]) => Promise<void[]>,
    imageUploadCancelHandler: (images: string[]) => Promise<void[]>
})

export type ImageUplaoderProps = {
	previewImages?: string[],
	onChange: (F: string[] ) => void,
	label: string,
	path: string,
	maxFileCount?: number
}