"use client";

import { getImageUrlFromBytescale } from "@repo/provider";
import { TableColumnGalleryProps } from "../types";
import { Modal } from "@repo/ui";
import { useState } from "react";
import { PatstoreImageUploader } from "@repo/ui";
import "../styles.scss";
import { isArray } from "lodash-es";

const TableColumnGallery = ({
	value = [],
	onChange,
	maxFileCount = 0
}: TableColumnGalleryProps) => {
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
								<img
									src={getImageUrlFromBytescale({
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
