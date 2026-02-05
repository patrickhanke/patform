"use client";

import { FC, useMemo } from "react";

import ImageGallery from "react-image-gallery";
// import stylesheet if you're not already using CSS @import
import "react-image-gallery/styles/css/image-gallery.css";
import { ImageGalleryProps } from "./types";
import { getImageUrl } from "@repo/provider";

const ImagesDisplay: FC<ImageGalleryProps> = ({ images, height = "240px" }) => {
	console.log({ images });
	const renderImages: { original: string; thumbnail: string }[] = useMemo(
		() =>
			images.map((image: string) => ({
				original: getImageUrl({ fileName: image }),
				thumbnail: getImageUrl({
					fileName: image,
					width: 80
				})
			})),
		[images]
	);

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
