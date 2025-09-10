import React, { useContext, useEffect, useMemo, useState } from "react";
import { UplaoderProps } from "../types";
import { useDataHandler, PatstoreAppContext } from "@repo/provider";
import { ImageClass } from "@repo/types";
import { Dropzone, FilesList, UploadButton } from "@uppy/react";

const Uploader: React.FC<UplaoderProps> = ({
	uppy,
	name,
	onComplete,
	afterUploadHandler,
	className,
	classKey,
	classId,
	inline = false
}) => {
	const { modules } = useContext(PatstoreAppContext);
	const { createUpdateFile } = useDataHandler();

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

	useEffect(() => {
		const el = document.querySelector(
			'[data-uppy-element="upload-button"]'
		);
		if (el) {
			console.log(el.textContent);
			el.textContent = "Hochladen";
		}
	}, []);

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
		return DashboardContent;
	}

	return (
		<div className={"uppy_upload_container"}>
			<Dropzone note="Dateien hier ablegen oder clicken um sie auszuwählen" />
			<div id="uppy-files-list">
				<FilesList key="files-list" />
			</div>
			<UploadButton>
				{isUploading ? "Wird hochgeladen..." : "Dateien hochladen"}
			</UploadButton>
		</div>
	);
};

export default Uploader;
