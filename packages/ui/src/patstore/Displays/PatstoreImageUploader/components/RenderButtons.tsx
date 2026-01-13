import { FC, useMemo } from "react";
import { isArray } from "lodash";
import { generateGraphQLQuery, getImageUrl, useGetData } from "@repo/provider";
import { useQuery } from "@apollo/client";
import Image from "next/image";
import { RenderButtonsProps } from "../types";

const RenderButtons: FC<RenderButtonsProps> = ({
	selectedImages,
	maxFileCount,
	onClick,
	previewImageSize = "sm"
}) => {
	const { data } = useGetData({
		objectName: "Image",
		fields: ["objectId", "file {name url}", "title"],
		id: selectedImages[0],
		skip: selectedImages.length !== 1 || maxFileCount !== 1
	});

	const imageSizes: { height: number; width: number } = useMemo(() => {
		const height = 36;
		const width = 64;

		if (previewImageSize === "sm") {
			return {
				width: width,
				height: height
			};
		}
		if (previewImageSize === "md") {
			return {
				width: width * 2,
				height: height * 2
			};
		}
		if (previewImageSize === "lg") {
			return {
				width: width * 4,
				height: height * 4
			};
		}
		if (previewImageSize === "xl") {
			return {
				width: width * 8,
				height: height * 8
			};
		}
		return {
			width: width,
			height: height
		};
	}, [previewImageSize]);

	if (maxFileCount > 1) {
		return (
			<button
				className="full_button sm light"
				type="button"
				onClick={() => onClick()}
			>
				{isArray(selectedImages) ? selectedImages?.length : "0"} Bilder
			</button>
		);
	} else if (maxFileCount === 1 && data) {
		return (
			<div onClick={() => onClick()} style={{ cursor: "pointer" }}>
				<Image
					alt={data?.title || data?.objectId}
					src={getImageUrl({
						fileName: data?.file?.name,
						height: imageSizes.height * 2,
						width: imageSizes.width * 2
					})}
					style={{ objectFit: "contain" }}
					height={imageSizes.height}
					width={imageSizes.width}
					fill={false}
				/>
			</div>
		);
	} else {
		return (
			<button className="full_button sm grey" onClick={() => onClick()}>
				+ Bild hinzufügen
			</button>
		);
	}
};

export default RenderButtons;
