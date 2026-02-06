"use client";

import { FC, useMemo } from "react";

import ImageGallery from "react-image-gallery";
// import stylesheet if you're not already using CSS @import
import "react-image-gallery/styles/css/image-gallery.css";
import { ImageGalleryProps } from "./types";
import { getImageUrl, useFindData } from "@repo/provider";
import { ImageClass } from "../../../../../types/src/patstore";
import { Loader } from "@repo/ui";

const ImagesDisplay: FC<ImageGalleryProps> = ({ images, height = "240px" }) => {
	const { data: imageData, loading } = useFindData({
		objectName: "Image",
		fields: ["objectId", "file { name url }"],
		filters: [
			{
				key: "objectId",
				value: images,
				operator: "in",
				id: "objectId"
			}
		]
	});
	console.log({ imageData });
	const renderImages: { original: string; thumbnail: string }[] = useMemo(
		() =>
			imageData?.map((image: ImageClass) => ({
				original: getImageUrl({ fileName: image.file?.name }),
				thumbnail: getImageUrl({
					fileName: image.title,
					width: 80
				})
			})),
		[imageData]
	);

	if (loading) {
		return <Loader width={`${height}px`} height={`${height}px`} />;
	}

	if (!imageData) {
		return <p>Keine Bilder vorhanden</p>;
	}

	return (
		<div style={{ position: "relative", height }}>
			{!renderImages || renderImages.length === 0 ? (
				<p>Keine Bilder vorhanden</p>
			) : (
				<ImageGallery
					showPlayButton={false}
					items={renderImages}
					autoPlay={false}
					slideOnThumbnailOver={false}
					showThumbnails={false}
					showFullscreenButton={true}
					showBullets={true}
					useBrowserFullscreen={false}
				/>
			)}
		</div>
	);
};

export default ImagesDisplay;
