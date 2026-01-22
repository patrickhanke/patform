import { cloneDeep } from "lodash-es";
import { FC, useCallback } from "react";
import { ImageClass } from "@repo/types";
import { SelectedImagesProps } from "./types";
import { useFindData } from "@repo/provider";
import DisplaySelectedImages from "./components/DisplaySelectedImages";

const SelectedImages: FC<SelectedImagesProps> = ({
	selectedImages,
	setSelectedImages,
	maxFileCount
}) => {
	const { data } = useFindData({
		objectName: "Image",
		fields: ["objectId", "file {name url}", "title"],
		filters: [
			{
				key: "objectId",
				id: "objectId",
				operator: "in",
				value: selectedImages
			}
		]
	});

	const removeImageHandler = useCallback((imageId: string) => {
		const selectedImagesCopy = cloneDeep(selectedImages);
		const imageIndex = selectedImagesCopy.findIndex(
			(selImage) => selImage === imageId
		);

		if (imageIndex > -1) {
			selectedImagesCopy.splice(imageIndex, 1);
		}

		setSelectedImages(selectedImagesCopy);
	}, []);

	if (!data) {
		return null;
	}

	const images = data;

	return (
		<div>
			<h3>Ausgewählte Bilder</h3>
			<div className="flex row ai-ce j-sb gap-sm wrap">
				{images.map((image: ImageClass) => {
					return (
						<DisplaySelectedImages
							key={image.objectId}
							id={image.objectId}
							image={image.file}
							name={image.title || image.file?.name || ""}
							maxFileCount={maxFileCount}
							removeImageHandler={removeImageHandler}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default SelectedImages;
