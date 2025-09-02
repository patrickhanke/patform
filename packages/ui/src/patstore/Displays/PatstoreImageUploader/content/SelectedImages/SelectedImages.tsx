import { cloneDeep } from "lodash-es";
import { FC, useCallback } from "react";
import { ImageClass } from "@repo/types";
import { SelectedImagesProps } from "./types";
import { generateGraphQLQuery } from "@repo/provider";
import { useQuery } from "@apollo/client";
import DisplaySelectedImages from "./components/DisplaySelectedImages";

const SelectedImages: FC<SelectedImagesProps> = ({
	selectedImages,
	setSelectedImages,
	maxFileCount
}) => {
	const { data } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Image",
			fields: ["objectId", "file {name url}", "name"]
		}),
		{
			variables: {
				params: {
					objectId: { _in: selectedImages }
				}
			}
		}
	);

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

	const images = data.objects.findImage.results;

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
							name={image.name}
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
