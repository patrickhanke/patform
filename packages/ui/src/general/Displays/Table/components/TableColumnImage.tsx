"use client";

import { generateImagePath, getImageUrl, useAppContext } from "@repo/provider";
import { TableColumnImageProps } from "../types";
import { Modal, IconButton } from "@repo/ui";
import { useState } from "react";
import { ImageUploader } from "@repo/ui";
import "../styles.scss";

const TableColumnImage = ({
	url,
	isEditable = false,
	onChange,
	maxFileCount
}: TableColumnImageProps) => {
	const { project } = useAppContext();

	const [isOpen, setIsOpen] = useState(false);
	const [image, setImage] = useState("");

	return (
		<>
			<div className="horizontal_container">
				<div>
					{url ? (
						<div className="table_columns_image_container">
							<img
								src={getImageUrl({ filePath: url, height: 30 })}
							/>
						</div>
					) : (
						<button
							className="full_button sm grey"
							onClick={() => setIsOpen(true)}
						>
							+ Bild hinzufügen
						</button>
					)}
				</div>
				<div className="table_vertical_container">
					{isEditable && (
						<IconButton
							icon="edit"
							onClick={() => setIsOpen(true)}
						/>
					)}
					{url && (
						<IconButton
							onClick={() => null}
							icon="download"
							isLink
							isBlank
							link={getImageUrl({ filePath: url })}
						/>
					)}
				</div>
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
					onChange={(imgUrl) => setImage(imgUrl as string)}
					path={generateImagePath(
						process.env.APP_NAME as string,
						project.path
					)}
					maxFileCount={maxFileCount}
					previewImage={image}
					returnType="string"
				/>
			</Modal>
		</>
	);
};

export default TableColumnImage;
