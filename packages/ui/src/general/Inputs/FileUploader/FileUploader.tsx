"use client";

import "./styles.scss";
import { FileUplaoderProps } from "./types";
import "./styles.scss";

import "@uppy/react/css/style.css";

import { useEffect, useMemo, useState } from "react";
import Uploader from "./components/Uploader";
import { Modal } from "../../Overlays";
import Uppy from "@uppy/core";
import { UppyContextProvider } from "./components/UppyContextProvider";
import getOriginalFileName from "./functions/getOriginalFileName";

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
	existingFile,
	inline = false
}: FileUplaoderProps) => {
	const [uploadModal, setUploadModal] = useState(false);

	// const { uppy } = useContext(UppyContext);

	const uppy = useMemo(
		() =>
			new Uppy({
				restrictions: {
					maxNumberOfFiles: 1 // default
				}
			}),
		[]
	);

	// Update restrictions whenever maxFiles changes
	useEffect(() => {
		uppy.setOptions({
			restrictions: {
				...uppy.opts.restrictions, // preserve existing restrictions
				maxNumberOfFiles: 1
			}
		});
	}, [uppy]);
	

	if (inline) {
		<UppyContextProvider maxFileCount={maxFileCount} type={type}>
			<Uploader
				type={type}
				uppy={uppy}
				classKey={classKey}
				className={className}
				classId={classId}
				afterUploadHandler={afterUploadHandler}
				inline={inline}
				name={name}
				onComplete={onComplete}
			/>
		</UppyContextProvider>;
	}

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

	return (
		<UppyContextProvider maxFileCount={maxFileCount} type={type}>
			<div className={"upload_container"}>
				<button
					type="button"
					className="full_button sm grey"
					onClick={() => {
						if (setSecondaryContent) {
							return setSecondaryContent(
								<Uploader
									uppy={uppy}
									type={type}
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
					{buttonText()}
				</button>

				{!setSecondaryContent && uploadModal && (
					<Modal
						isOpen={uploadModal}
						cancelButtonHandler={() => setUploadModal(false)}
						cancelButtonText="Schließen"
						header={
							type === "image"
								? "Bild hochladen"
								: "Datei hochladen"
						}
					>
						<Uploader
							uppy={uppy}
							type={type}
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
		</UppyContextProvider>
	);
};

export default FileUploader;
