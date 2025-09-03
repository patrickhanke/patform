"use client";

import "./styles.scss";
import { FileUplaoderProps } from "./types";
import "./styles.scss";

import "@uppy/react/css/style.css";
import Dashboard from "@uppy/react/dashboard";

import {
	Dropzone,
	FilesList,
	UploadButton,
	UppyContext,
	FilesGrid
} from "@uppy/react";
import { Uppy } from "@uppy/core";
import { useContext, useEffect, useState } from "react";
import Module from "module";
import { PatstoreAppContext, useDataHandler } from "@repo/provider";
import Uploader from "./components/Uploader";

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
	const { uppy } = useContext(UppyContext);
	// const { modules } = useContext(PatstoreAppContext);
	// const { createUpdateFile } = useDataHandler();

	// const [uploadModal, setUploadModal] = useState(false);
	// const [isUploading, setIsUploading] = useState(false);
	// const [isComplete, setIsComplete] = useState(false);

	// uppy.on("upload-success", (file, response) => {
	// 	console.log("Upload successful:", file?.name, response);
	// });

	// uppy.on("upload-error", (file, error, response) => {
	// 	console.error("Upload error:", file?.name, error, response);
	// });
	// const moduleId = modules.find(
	// 	(module: Module) => module.connected_class === className
	// )?.objectId;

	// useEffect(() => {
	// 	const uploadSuccessHandler = async () => {
	// 		console.log("uploadSuccessHandler");
	// 		const files = uppy.getFiles();
	// 		const imageArray: string[] = [];
	// 		if (!isComplete) {
	// 			console.log({ className, classKey, moduleId });
	// 			if (className && classKey && moduleId) {
	// 				for (const file of files) {
	// 					try {
	// 						await createUpdateFile({
	// 							file,
	// 							name: name || (file.name as string),
	// 							moduleId: moduleId,
	// 							className,
	// 							classKey,
	// 							classId,
	// 							feedback: "Bild erfolgreich hochgeladen",
	// 							afterSaveHandler: (image: ImageClass) => {
	// 								imageArray.push(image.file.url);
	// 							}
	// 						});
	// 					} catch (error) {
	// 						console.error(error);
	// 					}
	// 				}
	// 			}

	// 			uppy.emit("complete", {
	// 				successful: uppy.getFiles().filter((f) => !f.error),
	// 				failed: uppy.getFiles().filter((f) => f.error)
	// 			});

	// 			setIsComplete(true);

	// 			if (afterUploadHandler) {
	// 				afterUploadHandler(imageArray);
	// 			}
	// 		}
	// 	};

	// 	uppy.on("upload", uploadSuccessHandler);

	// 	// Clean up by removing the listener
	// 	return () => {
	// 		uppy.off("upload", uploadSuccessHandler);
	// 	};
	// }, [uppy, isComplete, className, classKey, classId]);
	// console.log(uppy);
	// console.log(uppy?.getFiles());

	if (!uppy) {
		return null;
	}

	// return (
	// 	<div>
	// 		<Dropzone note="Dateien hier ablegen oder clicken um sie auszuwählen" />
	// 		<FilesGrid />
	// 		<FilesList />
	// 		<UploadButton>Dateien hochladen</UploadButton>
	// 	</div>
	// );

	return (
		<div>
			<Uploader
				uppy={uppy}
				type={type}
				classKey={classKey}
				className={className}
				classId={classId}
				setSecondaryContent={setSecondaryContent}
				afterUploadHandler={afterUploadHandler}
				maxFileCount={maxFileCount}
				existingFiles={existingFiles}
				inline={inline}
				name={name}
				onComplete={onComplete}
			/>
		</div>
	);
};

export default FileUploader;
