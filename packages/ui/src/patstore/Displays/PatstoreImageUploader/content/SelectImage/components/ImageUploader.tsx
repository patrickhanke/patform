"use client";

import { FC, useState } from "react";
import "../styles.scss";

import { FileUploader } from "@repo/ui";
import { ImageUploaderProps } from "../types";
// import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/css/style.min.css";

const ImageUploader: FC<ImageUploaderProps> = ({
	onComplete,
	maxFileCount,
	afterUploadHandler,
	classId
}) => {
	const [isComplete, setIsComplete] = useState(false);

	if (isComplete) {
		return (
			<div className="uppy_upload_container">
				<p>Dateien wurden erfolgreich hochgeladen</p>
				<div className="button_container">
					{onComplete && (
						<button
							className="full_button md primary"
							onClick={() => onComplete()}
						>
							Zurück
						</button>
					)}
					<button
						className="full_button md secondary"
						onClick={() => setIsComplete(false)}
					>
						Weitere Bilder hochladen
					</button>
				</div>
			</div>
		);
	}

	return (
		<FileUploader
			classKey="file"
			className="Image"
			classId={classId}
			afterUploadHandler={afterUploadHandler}
			maxFileCount={maxFileCount}
			existingFiles={0}
			type="image"
			inline
		/>
	);
};

export default ImageUploader;
