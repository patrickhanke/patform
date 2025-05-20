"use client";

import { FC, useCallback, useMemo, useState } from "react";
import { SlideIn } from "@repo/ui";
import SelectImage from "./content/SelectImage";
import { PatstoreSelectImagesProps } from "./types";
import SelectedImages from "./content/SelectedImages";
import RenderButtons from "./components/RenderButtons";

const checkForImages = (
	image: string | string[] | undefined,
	maxFileCount: number
) => {
	if (!image && maxFileCount == 1) {
		return [];
	}
	if (typeof image === "string" && image.length === 10) {
		return [image];
	}
	if (Array.isArray(image) && image.length > 0 && image[0]?.length === 10) {
		return image;
	}
	return [];
};

const PatstoreSelectImages: FC<PatstoreSelectImagesProps> = ({
	image,
	onChange,
	maxFileCount,
	previewImageSize
}) => {
	const [selectImages, setSelectImages] = useState(false);
	const [selectedImages, setSelectedImages] = useState<string[]>(
		checkForImages(image, maxFileCount)
	);

	const secondaryContent = useMemo(() => {
		if (!selectImages) {
			return null;
		}
		return (
			<SelectImage
				maxFileCount={maxFileCount}
				selectedImages={selectedImages}
				setSelectedImages={setSelectedImages}
			/>
		);
	}, [selectedImages, selectImages, maxFileCount]);

	const confirmHandler = useCallback(async () => {
		await onChange(maxFileCount > 1 ? selectedImages : selectedImages[0]);
		setSelectImages(false);
	}, [selectedImages, maxFileCount]);

	return (
		<>
			<RenderButtons
				selectedImages={checkForImages(image, maxFileCount || 1)}
				maxFileCount={maxFileCount}
				onClick={() => setSelectImages(true)}
				previewImageSize={previewImageSize}
			/>
			<SlideIn
				header={
					maxFileCount > 1 ? "Bilder auswählen" : "Bild auswählen"
				}
				isOpen={selectImages}
				cancel={() => setSelectImages(false)}
				confirm={() => confirmHandler()}
				secondaryContent={secondaryContent}
				showSecondaryContent
			>
				<SelectedImages
					selectedImages={selectedImages}
					setSelectedImages={setSelectedImages}
					maxFileCount={maxFileCount}
				/>
			</SlideIn>
		</>
	);
};

export default PatstoreSelectImages;
