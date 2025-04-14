import React, { useCallback, useMemo } from "react";
import "./styles.scss";
import {
	UploadDropzone,
	UploadDropzoneConfig
} from "@bytescale/upload-widget-react";
import { ErrorDisplay, ImageDisplay } from "@repo/ui";
import { Image } from "@repo/types";
import { generateImagePath, useAppContext } from "@repo/provider";

const ImageUploader = ({
	previewImage,
	onChange,
	label,
	maxFileCount,
	deleteHandler,
	filename,
	crop = false,
	preview = false,
	returnType = "array"
}: {
	previewImage?: Image | Image[];
	onChange: (F: Image[] | Image) => void;
	label: string;
	maxFileCount?: number;
	filename?: string;
	deleteHandler?: (image: Image) => void;
	crop?: boolean;
	preview?: boolean;
	returnType?: "array" | "string";
}) => {
	const { project } = useAppContext();

	const [reinitialize, setReinitialize] = React.useState(true);
	const options = useMemo(() => {
		const configObject: UploadDropzoneConfig = {
			apiKey: process.env.BYTESCALE_PUBLIC_KEY as string,
			maxFileCount: maxFileCount || 10,
			showFinishButton: true,
			editor: {
				images: {
					preview,
					crop
				}
			},
			locale: {
				addAnotherFileBtn: "Weitere Datei ...",
				addAnotherImageBtn: "Weiteres Bild ...",
				cancelBtn: "abbrechen",
				cancelBtnClicked: "abgebrochen",
				cancelPreviewBtn: "Abbrechen",
				continueBtn: "Weiter",
				cropBtn: "Zuschneiden",
				customValidationFailed: "Failed to validate file.",
				doneBtn: "Fertig",
				fileSizeLimitPrefix: "Dateigrößenlimit:",
				finishBtn: "Fertig",
				finishBtnIcon: true,
				imageCropNumberPrefix: "Bild",
				maxFilesReachedPrefix: "Dateillimit erreicht",
				maxImagesReachedPrefix: "Bildlimit erreicht",
				orDragDropFile: "...oder eine Datei hierher ziehen.",
				orDragDropFileMulti: "...oder Dateien hierher ziehen.",
				orDragDropImage: "...order Bild hierher ziehen.",
				orDragDropImageMulti: "...oder Bilder hierher ziehen.",
				processingFile: "Verarbeite Datei...",
				removeBtn: "entfernen",
				removeBtnClicked: "enfernt",
				submitBtnError: "Fehler!",
				submitBtnLoading: "Bitte warten...",
				unsupportedFileType: "Datei nicht unterstützt.",
				uploadFileBtn: "Datei hochladen",
				uploadFileMultiBtn: "Dateien Hochladen",
				uploadImageBtn: "Bild hochladen",
				uploadImageMultiBtn: "Bilder hochladen",
				xOfY: "of"
			},
			path: {
				folderPath: `${generateImagePath(
					process.env.APP_NAME as string,
					project.path
				)}`
			},
			showRemoveButton: true,
			styles: {
				colors: {
					primary: "#3F9A82",
					active: "#2d3d38"
				}
			}
		};
		return configObject;
	}, [maxFileCount, filename]);

	const reinitializeHandler = useCallback(() => {
		setReinitialize(false);
		setTimeout(() => {
			setReinitialize(true);
		}, 100);
	}, []);

	const previewImages = useMemo(() => {
		if (previewImage) {
			if (Array.isArray(previewImage)) {
				return (
					<div className="image_uploader_display_container">
						{previewImage.map((image, index) => (
							<ImageDisplay
								key={index}
								image={image}
								deleteHandler={deleteHandler}
							/>
						))}
					</div>
				);
			}
			return (
				<ImageDisplay
					image={previewImage}
					deleteHandler={deleteHandler}
				/>
			);
		}
	}, [previewImage]);

	return (
		<div className={"upload_container"}>
			<label htmlFor="logo">{label}</label>
			{previewImage && previewImages}
			{reinitialize && (
				<UploadDropzone
					options={options}
					onComplete={(uploadedFiles) => {
						if (
							returnType === "string" &&
							uploadedFiles.length > 0
						) {
							const value = uploadedFiles[0]?.filePath || "";
							return onChange(value) as unknown as (
								F: string
							) => void;
						}
						onChange(
							uploadedFiles.map((file) => file.filePath)
						) as unknown as (F: Image[]) => void;
						reinitializeHandler();
					}}
					onUpdate={(files) => console.log({ files })}
					width="100%"
					height="fit-content"
					className={"upload_zone"}
				/>
			)}
			<ErrorDisplay id="uloader" errors={[]} />
		</div>
	);
};

export default ImageUploader;
