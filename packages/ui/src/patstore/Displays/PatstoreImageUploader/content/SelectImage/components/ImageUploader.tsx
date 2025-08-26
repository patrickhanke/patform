"use client";

import { FC, useContext, useEffect, useState } from "react";
import "../styles.scss";

import { ErrorDisplay } from "@repo/ui";
import { PatstoreAppContext, useDataHandler } from "@repo/provider";
import { ImageUploaderProps } from "../types";
import Uppy from "@uppy/core";
// import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/css/style.min.css";
import { Dashboard, UploadButton, useUppyState } from "@uppy/react";
import German from "@uppy/locales/lib/de_DE";
import { ImageClass, Module } from "@repo/types";

const createUppyInstance = (type: string, maxFileCount: number) =>
	new Uppy({
		logger: {
			debug: console.log,
			warn: console.warn,
			error: console.error
		},
		locale: German,
		meta: { type: "avatar" },
		restrictions: {
			maxNumberOfFiles: type === "add" ? 1 : maxFileCount || 5,
			allowedFileTypes: [
				"image/jpeg",
				"image/jpg",
				"image/png",
				"image/gif",
				"image/webp"
			],
			maxFileSize: 20000000
		},
		autoProceed: false
	});

const ImageUploader: FC<ImageUploaderProps> = ({
	onComplete,
	maxFileCount,
	afterUploadHandler,
	type = "create",
	className,
	classKey,
	classId
}) => {
	const { modules } = useContext(PatstoreAppContext);
	const [isComplete, setIsComplete] = useState(false);
	const { createImage, addImage } = useDataHandler();
	const [isUploading, setIsUploading] = useState(false);

	const uppy = createUppyInstance(type, maxFileCount);
	// const files = useUppyState(uppy, (state) => state.files);
	// console.log({ files });

	uppy.on("upload-success", (file, response) => {
		console.log("Upload successful:", file?.name, response);
	});

	uppy.on("upload-error", (file, error, response) => {
		console.error("Upload error:", file?.name, error, response);
	});

	const imageModule =
		modules && modules.find((module: Module) => module.path === "/images");

	useEffect(() => {
		// Custom upload logic
		const uploadSuccessHandler = async () => {
			const files = uppy.getFiles();

			const imageArray: string[] = [];
			if (!isComplete) {
				if (type === "create" && imageModule) {
					for (const file of files) {
						try {
							await createImage({
								file,
								name: file.name as string,
								moduleId: imageModule.objectId,
								feedback: "Bild erfolgreich hochgeladen",
								afterSaveHandler: (image: ImageClass) => {
									imageArray.push(image.file.url);
								}
							});
						} catch (error) {
							console.error(error);
						}
					}
				} else if (type === "add") {
					for (const file of files) {
						if (!className || !classKey || !classId) {
							console.error(
								"className or classKey or classId is not defined"
							);
							return;
						}
						try {
							await addImage({
								file,
								className,
								classKey,
								classId,
								feedback: "Bild erfolgreich hinzugefügt",
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
		<div className={"uppy_upload_container"}>
			<Dashboard
				theme="light"
				uppy={uppy}
				width={"100%"}
				height="360px"
				style={{ padding: "24px" }}
				proudlyDisplayPoweredByUppy={false}
				disabled={isUploading}
				showProgressDetails={true}
			/>
			<UploadButton />
			<ErrorDisplay id="uloader" errors={[]} />
		</div>
	);
};

export default ImageUploader;
