"use client";

import "./styles.scss";
import { FileUplaoderProps } from "./types";
import "./styles.scss";

import "@uppy/react/css/style.css";

import { UppyContext } from "@uppy/react";
import { useContext } from "react";
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

	if (!uppy) {
		return null;
	}

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
