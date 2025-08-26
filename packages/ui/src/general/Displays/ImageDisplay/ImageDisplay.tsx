"use client";

import { useCallback, useState } from "react";
import { ImageDisplayProps } from "./types";
import styles from "./ImageDisplay.module.scss";
import deleteImage from "./functions/deleteImage";
import * as Bytescale from "@bytescale/sdk";
import { Image as ImageType } from "@repo/types";
import Image from "rc-image";
import { saveAs } from "file-saver";
import { IconButton } from "@repo/ui";

const ImageDisplay = ({ image, deleteHandler, maxFileCount }: ImageDisplayProps) => {
	const [showDelete, setShowDelete] = useState(false);
	const [loading, setLoading] = useState(false);

	const imageDeleteHandler = (image: ImageType) => {
		setLoading(true);
		deleteImage({
			accountId: process.env.BYTESCALE_ACCOUNT_ID as string,
			apiKey: process.env.BYTESCALE_SECRET_KEY as string,
			querystring: {
				filePath: image
			}
		}).then((error) => console.error(error));
		if (deleteHandler) {
			deleteHandler(image);
		}
		setShowDelete(false);
		setLoading(false);
	};

	const getImageUrlFromBytescale = useCallback(() => {
		const url = Bytescale.UrlBuilder.url({
			accountId: process.env.BYTESCALE_ACCOUNT_ID as string,
			filePath: image,
			options: {
				transformation: "image",
				transformationParams: {
					h: 60
					// 'h': 45
				}
			}
		});

		return url;
	}, [image]);

	const downloadImage = async () => {
		const url = Bytescale.UrlBuilder.url({
			accountId: process.env.BYTESCALE_ACCOUNT_ID as string,
			filePath: image
		});
		saveAs(url, image);
	};

	return (
		<div className={styles.image_container}>
			{showDelete ? (
				<>
					<p>
						{!loading
							? "Sind sie Sicher, dass sie das Bild löschen möchten?"
							: "lädt..."}
					</p>
					<div className={styles.image_icons}>
						<IconButton
							icon={"cancel"}
							disabled={loading}
							onClick={() => setShowDelete(false)}
						/>
						<IconButton
							icon={"check"}
							disabled={loading}
							onClick={() => imageDeleteHandler(image)}
						/>
					</div>
				</>
			) : (
				<>
					<Image src={getImageUrlFromBytescale()} alt={image} />
					<div className={styles.image_icons}>
						<IconButton
							icon={"download"}
							onClick={() => downloadImage()}
						/>
						{deleteHandler && (
							<IconButton
								icon={"delete"}
								onClick={() => setShowDelete(true)}
							/>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default ImageDisplay;
