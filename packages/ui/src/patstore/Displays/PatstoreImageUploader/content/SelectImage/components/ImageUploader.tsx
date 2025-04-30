import React, { FC, useCallback, useMemo } from "react";
import "../styles.scss";
import {
	UploadDropzone,
	UploadDropzoneConfig
} from "@bytescale/upload-widget-react";
import { ErrorDisplay } from "@repo/ui";
import { generateImagePath, useAppContext } from "@repo/provider";
import { ImageUploaderProps } from "../types";

const ImageUploader: FC<ImageUploaderProps> = ({ onChange, maxFileCount }) => {
	const { project } = useAppContext();

	const [reinitialize, setReinitialize] = React.useState(true);
	const options = useMemo(() => {
		const configObject: UploadDropzoneConfig = {
			apiKey: process.env.BYTESCALE_PUBLIC_KEY as string,
			maxFileCount: maxFileCount || 20,
			showFinishButton: true,
			editor: {
				images: {
					preview: true,
					crop: true
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
	}, [maxFileCount]);

	const reinitializeHandler = useCallback(() => {
		setReinitialize(false);
		setTimeout(() => {
			setReinitialize(true);
		}, 100);
	}, []);

	return (
		<div className={"upload_container"}>
			{reinitialize && (
				<UploadDropzone
					options={options}
					onComplete={(uploadedFiles) => {
						onChange(
							uploadedFiles.map((file) => {
								return {
									filePath: file.filePath,
									fileName:
										file.originalFile.originalFileName ||
										file.filePath
								};
							})
						);
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
