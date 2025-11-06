"use client";

import { FC, useState } from "react";
import "../styles.scss";

import { FileUploader } from "@repo/ui";
import { ImageUploaderProps } from "../types";

const ImageUploader: FC<ImageUploaderProps> = ({
	onComplete,
	maxFileCount,
	afterUploadHandler,
	classId,
	setLoading
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
			type="image"
			inline
			setLoading={setLoading}
		/>
	);
};

export default ImageUploader;
