"use client";

import { getImageUrl, useFindData } from "@repo/provider";
import { TableColumnGalleryProps } from "../types";
import { Modal } from "@repo/ui";
import { useCallback, useState } from "react";
import { PatstoreImageUploader } from "@repo/ui";
import "../styles.scss";
import { isArray } from "lodash-es";
import { ImageClass } from "@repo/types";

const TableColumnGallery = ({
	value = [],
	onChange,
	maxFileCount = 0
}: TableColumnGalleryProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [image, setImage] = useState<string[]>([]);
	const { data: imageData } = useFindData({
		objectName: "Image",
		fields: ["objectId", "file { name url }"],
		filters: [
			{
				key: "objectId",
				value: value,
				operator: "in"
			}
		]
	});

	const getImageUrlHandler = useCallback(
		(imageId: string) => {
			return getImageUrl({
				fileName:
					imageData?.find(
						(image: ImageClass) => image.objectId === imageId
					)?.file?.name || "",
				width: 240
			});
		},
		[imageData]
	);

	return (
		<>
			<div>
				<button
					className="full_button sm light"
					type="button"
					onClick={() => setIsOpen(!isOpen)}
				>
					{isArray(value) ? value?.length : "0"} Bilder
				</button>
			</div>
			<Modal
				isOpen={isOpen}
				cancelButtonHandler={() => setIsOpen(false)}
				confirmButtonHandler={() => {
					onChange(image);
					setIsOpen(false);
				}}
				header={"Bilder ändern"}
				buttonDisabled={[false, !image]}
			>
				<PatstoreImageUploader
					maxFileCount={maxFileCount}
					afterUploadHandler={(images) => setImage(images)}
				/>
				{isArray(value) && value.length > 0 && (
					<div>
						<label>Bilder</label>
						{value.map((url: string) => (
							<div key={url}>
								<img src={getImageUrlHandler(url)} />
							</div>
						))}
					</div>
				)}
			</Modal>
		</>
	);
};

export default TableColumnGallery;
