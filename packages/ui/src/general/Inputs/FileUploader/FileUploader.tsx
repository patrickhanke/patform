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
