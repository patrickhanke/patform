"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import "./styles.scss";
import { ErrorDisplay, Modal } from "@repo/ui";
import { FileUplaoderProps } from "./types";
import "./styles.scss";
import { PatstoreAppContext, useDataHandler } from "@repo/provider";
import createUppyInstance from "./functions/createUppyInstance";
import { Dashboard } from "@uppy/react";
import { ImageClass, Module } from "@repo/types";

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
	const { modules } = useContext(PatstoreAppContext);
	const { createUpdateFile } = useDataHandler();

	const [uploadModal, setUploadModal] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [isComplete, setIsComplete] = useState(false);

	const uppy = createUppyInstance(type, type === "image" ? maxFileCount : 1);

	uppy.on("upload-success", (file, response) => {
		console.log("Upload successful:", file?.name, response);
	});

	uppy.on("upload-error", (file, error, response) => {
		console.error("Upload error:", file?.name, error, response);
	});
	const moduleId = modules.find(
		(module: Module) => module.connected_class === className
	)?.objectId;

	useEffect(() => {
		const uploadSuccessHandler = async () => {
			console.log("uploadSuccessHandler");
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
		};

		uppy.on("upload", uploadSuccessHandler);

		// Clean up by removing the listener
		return () => {
			uppy.off("upload", uploadSuccessHandler);
		};
	}, [uppy, isComplete]);

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

	useEffect(() => {
		const uploadStartHandler = () => setIsUploading(true);
		const uploadCompleteHandler = () => setIsUploading(false);

		uppy.on("upload", uploadStartHandler);
		uppy.on("complete", uploadCompleteHandler);

		return () => {
			uppy.off("upload", uploadStartHandler);
			uppy.off("complete", uploadCompleteHandler);
			uppy.clear();
		};
	}, [uppy]);

	const renderDropzone = useMemo(() => {
		return (
			<div className="uppy_upload_container">
				<Dashboard
					theme="light"
					uppy={uppy}
					width={"100%"}
					height="360px"
					style={{ padding: "24px" }}
					proudlyDisplayPoweredByUppy={false}
					disabled={isUploading}
				/>
				<ErrorDisplay id="uloader" errors={[]} />
			</div>
		);
	}, [isUploading, uppy]);

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

	if (inline) {
		return (
			<div className={"uppy_upload_container"}>
				{renderDropzone}
				<ErrorDisplay id="uloader" errors={[]} />
			</div>
		);
	}

	return (
		<div className={"upload_container"}>
			<button
				type="button"
				className="full_button sm grey"
				onClick={() => {
					if (setSecondaryContent) {
						return setSecondaryContent(renderDropzone);
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
					{renderDropzone}
				</Modal>
			)}
		</div>
	);
};

export default FileUploader;
