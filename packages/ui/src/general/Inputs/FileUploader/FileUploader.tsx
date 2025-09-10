"use client";

import "./styles.scss";
import { FileUplaoderProps } from "./types";
import "./styles.scss";

import "@uppy/react/css/style.css";

import { UppyContext } from "@uppy/react";
import { useContext, useMemo, useState } from "react";
import Uploader from "./components/Uploader";
import { Modal } from "../../Overlays";

const FileUploader = ({
	type = "image",
	name,
	onComplete,
	afterUploadHandler,
	maxFileCount = 5,
	className,
	classKey,
	classId,
	setSecondaryContent,
	existingFiles = 0,
	inline = false
}: FileUplaoderProps) => {
	const [uploadModal, setUploadModal] = useState(false);

	const { uppy } = useContext(UppyContext);

	const buttonText = useMemo(() => {
		if (type === "image" && maxFileCount === 1) {
			if (existingFiles && existingFiles > 0) {
				return existingFiles > 1 ? `${existingFiles} Bilder` : "1 Bild";
			}
			return "Bild hochladen";
		} else if (type === "image" && maxFileCount > 1) {
			if (existingFiles && existingFiles > 0) {
				return existingFiles > 1 ? `${existingFiles} Bilder` : "1 Bild";
			}
			return "Bilder hochladen";
		} else if (type === "file") {
			if (existingFiles && existingFiles > 0) {
				return existingFiles > 1
					? `${existingFiles} Dateien`
					: existingFiles;
			}
			return "Datei hochladen";
		} else {
			return "Dateien hochladen";
		}
	}, [existingFiles]);

	if (!uppy) {
		return null;
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
								uppy={uppy}
								classKey={classKey}
								className={className}
								classId={classId}
								afterUploadHandler={afterUploadHandler}
								inline={inline}
								name={name}
								onComplete={onComplete}
							/>
						);
					}
					setUploadModal(true);
				}}
			>
				{buttonText}
			</button>

			{!setSecondaryContent && uploadModal && (
				<Modal
					isOpen={uploadModal}
					cancelButtonHandler={() => setUploadModal(false)}
					cancelButtonText="Schließen"
					header="Upload Image"
				>
					<Uploader
						uppy={uppy}
						classKey={classKey}
						className={className}
						classId={classId}
						afterUploadHandler={afterUploadHandler}
						inline={inline}
						name={name}
						onComplete={onComplete}
					/>
				</Modal>
			)}
		</div>
	);
};

export default FileUploader;
