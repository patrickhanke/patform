import React, { useContext, useEffect, useMemo, useState } from "react";
import { UplaoderProps } from "../types";
import { useDataHandler, PatstoreAppContext } from "@repo/provider";
import { Modal } from "@repo/ui";
import { ImageClass } from "@repo/types";
import {
	Dropzone,
	FilesList,
	UploadButton,
	UppyContext,
	useUppyState
} from "@uppy/react";

const Uploader: React.FC<UplaoderProps> = ({
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
}) => {
	const { uppy } = useContext(UppyContext);

	const { modules } = useContext(PatstoreAppContext);
	const { createUpdateFile } = useDataHandler();

	const [uploadModal, setUploadModal] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [isComplete, setIsComplete] = useState(false);

	const moduleId = modules.find(
		(module) => module.connected_class === className
	)?.objectId;

	useEffect(() => {
		const uploadSuccessHandler = async () => {
			setIsUploading(true);
			const files = uppy.getFiles();
			const imageArray: string[] = [];
			if (!isComplete) {
				console.log({ className, classKey, moduleId });
				if (className && classKey && moduleId) {
					for (const file of files) {
						try {
							await createUpdateFile({
								file,
								name: name || (file.name as string),
								moduleId: moduleId,
								className,
								classKey,
								classId,
								feedback: "Bild erfolgreich hochgeladen",
								afterSaveHandler: (image: ImageClass) => {
									imageArray.push(image.file.url);
								}
							});
						} catch (error) {
							console.error(error);
						}
					}
				}

				uppy.emit("complete", {
					successful: uppy.getFiles().filter((f) => !f.error),
					failed: uppy.getFiles().filter((f) => f.error)
				});

				setIsComplete(true);

				if (afterUploadHandler) {
					afterUploadHandler(imageArray);
				}
			}
			setIsUploading(false);
		};
		uppy.clear();
		uppy.on("upload", uploadSuccessHandler);

		// Clean up by removing the listener
		return () => {
			uppy.off("upload", uploadSuccessHandler);
		};
	}, [uppy, isComplete, className, classKey, classId]);

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
					: "1 Datei";
			}
			return "Datei hochladen";
		} else {
			return "Dateien hochladen";
		}
	}, [existingFiles]);

	console.log({ isUploading });

	const DashboardContent = useMemo(
		() => (
			<div className={"uppy_upload_container"}>
				<Dropzone note="Dateien hier ablegen oder clicken um sie auszuwählen" />
				<div id="uppy-files-list">
					<FilesList key="files-list" />
				</div>
				<UploadButton>Dateien hochladen</UploadButton>
			</div>
		),
		[]
	);

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

	useEffect(() => {
		const el = document.querySelector(
			'[data-uppy-element="upload-button"]'
		);
		if (el) {
			console.log(el.textContent);
			el.textContent = "Hochladen";
		}
	}, []);

	console.log({ inline });

	if (inline) {
		return DashboardContent;
	}

	return (
		<div className={"upload_container"}>
			<button
				type="button"
				className="full_button sm grey"
				onClick={() => {
					if (setSecondaryContent) {
						return setSecondaryContent(DashboardContent);
					}
					setUploadModal(true);
				}}
			>
				{buttonText}
			</button>
			{!setSecondaryContent && (
				<Modal
					isOpen={uploadModal}
					cancelButtonHandler={() => setUploadModal(false)}
					cancelButtonText="Schließen"
					header="Upload Image"
				>
					{DashboardContent}
				</Modal>
			)}
		</div>
	);
};

export default Uploader;
