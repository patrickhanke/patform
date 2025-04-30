"use client";

import { FC, useMemo, useState } from "react";
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
	maxFileCount
}) => {
	const [selectImages, setSelectImages] = useState(false);
	const [selectedImages, setSelectedImages] = useState<string[]>(
		checkForImages(image, maxFileCount || 1)
	);

	const secondaryContent = useMemo(() => {
		return (
			<SelectImage
				maxFileCount={maxFileCount || 1}
				selectedImages={selectedImages}
				setSelectedImages={setSelectedImages}
			/>
		);
	}, [selectedImages]);

	return (
		<>
			<RenderButtons
				selectedImages={selectedImages}
				maxFileCount={maxFileCount || 1}
				onClick={() => setSelectImages(true)}
				selectImages={selectImages}
			/>

			<SlideIn
				header="Bilder auswählen"
				isOpen={selectImages}
				cancel={() => setSelectImages(false)}
				confirm={async () => {
					if (onChange) {
						onChange(
							maxFileCount > 1
								? selectedImages
								: selectedImages[0]
						);
					}
					setSelectImages(false);
				}}
				secondaryContent={secondaryContent}
				showSecondaryContent
			>
				<SelectedImages
					selectedImages={selectedImages}
					setSelectedImages={setSelectedImages}
					maxFileCount={maxFileCount || 1}
				/>
			</SlideIn>
		</>
	);
};

export default PatstoreSelectImages;
