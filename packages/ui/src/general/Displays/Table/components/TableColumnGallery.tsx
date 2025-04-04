"use client";

import { generateImagePath, getImageUrl, useAppContext } from "@repo/provider";
import { TableColumnGalleryProps } from "../types";
import { Modal } from "@repo/ui";
import { useState } from "react";
import { ImageUploader } from "@repo/modules";
import "../styles.scss";
import { isArray } from "lodash-es";

const TableColumnGallery = ({
	value = [],
	onChange,
	maxFileCount = 0
}: TableColumnGalleryProps) => {
	const { project } = useAppContext();
	const [isOpen, setIsOpen] = useState(false);
	const [image, setImage] = useState<string[]>([]);

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
				header={"Bild ändern"}
				buttonDisabled={[false, !image]}
			>
				<ImageUploader
					label="Bild"
					onChange={(imgUrl) => setImage(imgUrl as string[])}
					path={generateImagePath(
						process.env.APP_NAME as string,
						project.path
					)}
					returnType="array"
					maxFileCount={maxFileCount}
				/>
				{isArray(value) && value.length > 0 && (
					<div>
						<label>Bilder</label>
						{value.map((url: string) => (
							<div key={url}>
								<img
									src={getImageUrl({
										filePath: url,
										width: 240
									})}
								/>
							</div>
						))}
					</div>
				)}
			</Modal>
		</>
	);
};

export default TableColumnGallery;
