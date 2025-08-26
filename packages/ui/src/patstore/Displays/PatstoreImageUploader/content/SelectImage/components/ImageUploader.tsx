"use client";

import { FC, useContext, useEffect, useState } from "react";
import "../styles.scss";

import { ErrorDisplay } from "@repo/ui";
import { PatstoreAppContext, useDataHandler } from "@repo/provider";
import { ImageUploaderProps } from "../types";
import { Dashboard } from "@uppy/react";
import Uppy from "@uppy/core";
// import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/css/style.min.css";
import German from "@uppy/locales/lib/de_DE";
import { ImageClass, Module } from "@repo/types";

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

	const imageModule =
		modules && modules.find((module: Module) => module.path === "/images");

	const uppy = new Uppy({
		debug: true,
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

			maxFileSize: 2000000
		},
		autoProceed: false
	});

	// Optional: Add event listeners
	uppy.on("upload-success", (file, response) => {
		console.log("Upload successful:", file?.name, response);
	});

	uppy.on("upload-error", (file, error, response) => {
		console.error("Upload error:", file?.name, error, response);
	});

	useEffect(() => {
		// Custom upload logic
		uppy.on("upload", async () => {
			const files = uppy.getFiles();
			if (!imageModule) {
				return;
			}
			const imageArray: string[] = [];
			if (type === "create") {
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
		});

		return () => uppy.clear();
	}, [uppy]);

	if (isComplete) {
		return (
			<>
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
			</>
		);
	}

	return (
		<div className={"upload_container"}>
			<Dashboard
				theme="light"
				uppy={uppy}
				width={"100%"}
				height="360px"
			/>
			;
			<ErrorDisplay id="uloader" errors={[]} />
		</div>
	);
};

export default ImageUploader;
