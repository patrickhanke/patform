"use client";

import "./styles.scss";
import { FileUplaoderProps } from "./types";
import "./styles.scss";

import { useState } from "react";
import Uploader from "./components/Uploader";
import { Modal } from "../../Overlays";
import getOriginalFileName from "./functions/getOriginalFileName";

const FileUploader = ({
	type = "image",
	afterUploadHandler,
	maxFileCount = 5,
	className,
	classKey,
	classId,
	setSecondaryContent,
	existingFile,
	inline = false,
	setLoading
}: FileUplaoderProps) => {
	const [uploadModal, setUploadModal] = useState(false);

	const buttonText = () => {
		if (existingFile && existingFile.name) {
			return getOriginalFileName(existingFile);
		} else if (type === "image" && maxFileCount === 1) {
			return "Bild hochladen";
		} else if (type === "image" && maxFileCount > 1) {
			return "Bilder hochladen";
		} else if (type === "file" && maxFileCount === 1) {
			return "Datei hochladen";
		} else {
			return "Dateien hochladen";
		}
	};

	if (inline === true) {
		return (
			<Uploader
				type={type}
				classKey={classKey}
				className={className}
				classId={classId}
				afterUploadHandler={afterUploadHandler}
				setLoading={setLoading}
			/>
		);
	}

	return (
		<div className={"upload_container"}>
			<button
				type="button"
				className="full_button sm grey"
				onClick={() => {
					if (setSecondaryContent) {
						return setSecondaryContent(
							<Uploader
								type={type}
								classKey={classKey}
								className={className}
								classId={classId}
								afterUploadHandler={afterUploadHandler}
								setLoading={setLoading}
							/>
						);
					}
					setUploadModal(true);
				}}
			>
				{buttonText()}
			</button>

			{!setSecondaryContent && uploadModal && (
				<Modal
					isOpen={uploadModal}
					cancelButtonHandler={() => setUploadModal(false)}
					cancelButtonText="Schließen"
					header={
						type === "image" ? "Bild hochladen" : "Datei hochladen"
					}
					styles={{
						minHeight: "480px"
					}}
				>
					<Uploader
						type={type}
						classKey={classKey}
						className={className}
						classId={classId}
						afterUploadHandler={afterUploadHandler}
						setLoading={setLoading}
					/>
				</Modal>
			)}
		</div>
	);
};

export default FileUploader;
