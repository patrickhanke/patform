import { useDataHandler } from "@repo/provider";
import { UseFileDataHandlerProps } from "../types";
import { deleteImageHandler } from "@repo/modules";

const useFileDataHandler = ({
	projectId,
	afterSaveFunction,
	afterCancelFunction
}: UseFileDataHandlerProps) => {
	const { createData } = useDataHandler();

	const imageUploadHandler = async (images: string[]) => {
		const uploadArray = images.map(async (image) => {
			await createData({
				className: "Image",
				updateObject: {
					project: {
						__type: "Pointer",
						className: "Project",
						objectId: projectId
					},
					name: "Neues Bild",
					filePath: image
				}
			});
		});

		await Promise.all(uploadArray);

		if (afterSaveFunction) {
			afterSaveFunction();
		}
	};

	const imageUploadCancelHandler = async (images: string[]) => {
		await Promise.all(
			images.map(async (image: string) => {
				deleteImageHandler({
					accountId: process.env.BYTESCALE_ACCOUNT_ID as string,
					apiKey: process.env.BYTESCALE_SECRET_KEY as string,
					filePath: image
				}).then((error) => console.error(error));
			})
		);

		if (afterCancelFunction) {
			afterCancelFunction();
		}
	};

	return {
		imageUploadHandler,
		imageUploadCancelHandler
	};
};

export default useFileDataHandler;
