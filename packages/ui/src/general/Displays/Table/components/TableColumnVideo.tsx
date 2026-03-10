import { Button, Modal, SwitchButton, SwitchButtons } from "@repo/ui";
import { useMemo, useState } from "react";
import {
	UploadDropzone,
	UploadDropzoneConfig
} from "@bytescale/upload-widget-react";
import { getImageUrlFromBytescale, useAppContext } from "@repo/provider";

const myCustomLocale = {
	addAnotherFileBtn: "Ein weiteres Video hochladen",
	addAnotherImageBtn: "Ein weiteres Video hochladen",
	cancelBtn: "Abbrechen",
	cancelBtnClicked: "abgebrochen",
	cancelPreviewBtn: "Abbrechen",
	continueBtn: "Weiter",
	cropBtn: "Zuschneiden",
	customValidationFailed: "Fehler beim Validieren der Datei.",
	doneBtn: "Fertig",
	fileSizeLimitPrefix: "Dateigröße limit:",
	finishBtn: "Fertig",
	finishBtnIcon: true,
	imageCropNumberPrefix: "Video",
	maxFilesReachedPrefix: "Maximum number of files:",
	maxImagesReachedPrefix: "Maximum number of images:",
	orDragDropFile: "...or drag and drop a file.",
	orDragDropFileMulti: "...oder ziehen Sie ein Video in den Bereich.",
	orDragDropImage: "...oder ziehen Sie ein Bild in den Bereich.",
	orDragDropImageMulti: "...oder ziehen Sie Bilder in den Bereich.",
	processingFile: "Processing file...",
	removeBtn: "remove",
	removeBtnClicked: "removed",
	submitBtnError: "Error!",
	submitBtnLoading: "Please wait...",
	unsupportedFileType: "File type not supported.",
	uploadFileBtn: "Upload a File",
	uploadFileMultiBtn: "Upload Files",
	uploadImageBtn: "Upload an Image",
	uploadImageMultiBtn: "Upload Images",
	xOfY: "of"
};

const TableColumnVideo = ({
	value,
	onChange,
	id
}: {
	value: string;
	onChange: (filePath: string) => void;
	id: string;
}) => {
	const [filePath, setFilePath] = useState<string | null>(value || null);
	const { project } = useAppContext();
	const [isOpen, setIsOpen] = useState(false);
	const options: UploadDropzoneConfig = useMemo(
		() => ({
			apiKey: process.env.BYTESCALE_PUBLIC_KEY as string,
			// accountId: process.env.BYTESCALE_ACCOUNT_ID as string,
			locale: myCustomLocale, // EN_US by default. (See "Localization" section below.)
			maxFileCount: 1,
			mimeTypes: ["video/*"],
			multi: false, // False by default.
			showFinishButton: true, // Show/hide the "finish" button in the widget.
			showRemoveButton: true, // Show/hide the "remove" button next to each file.
			metadata: {
				class_id: id
			},
			styles: {
				breakpoints: {
					fullScreenWidth: 750, // Full-screen mode activates when the screen is at or below this width.
					fullScreenHeight: 420 // Full-screen mode activates when the screen is at or below this height.
				},
				colors: {
					primary: "#377dff", // Primary buttons & links
					active: "#528fff", // Primary buttons & links (hover). Inferred if undefined.
					error: "#d23f4d", // Error messages
					shade100: "#333", // Standard text
					shade200: "#7a7a7a", // Secondary button text
					shade300: "#999", // Secondary button text (hover)
					shade400: "#a5a6a8", // Welcome text
					shade500: "#d3d3d3", // Modal close button
					shade600: "#dddddd", // Border
					shade700: "#f0f0f0", // Progress indicator background
					shade800: "#f8f8f8", // File item background
					shade900: "#fff" // Various (draggable crop buttons, etc.)
				},
				fontFamilies: {
					base: "arial, sans-serif" // Base font family (comma-delimited).
				},
				fontSizes: {
					base: 14 // Base font size (px).
				}
			},

			path: {
				fileName: "{ORIGINAL_FILE_NAME}_{UTC_TIME}{ORIGINAL_FILE_EXT}",
				folderPath: `/patstore/${project?.path ?? "unbestimmt"}/videos`
			}
		}),
		[id, project?.path]
	);

	const siteStates: SwitchButton[] = useMemo(
		() => [
			{
				value: "video",
				label: "Video",
				disabled: !filePath
			},
			{
				value: "upload",
				label: "Upload"
			}
		],
		[filePath]
	);

	const [siteState, setSiteState] = useState<SwitchButton>(
		filePath
			? {
					value: "video",
					label: "Video"
				}
			: {
					value: "upload",
					label: "Upload"
				}
	);

	return (
		<div>
			<Button
				text={value ? "Video ersetzen" : "Video hochladen"}
				onClick={() => setIsOpen(true)}
				size={12}
			/>
			<Modal
				isOpen={isOpen}
				cancelButtonHandler={() => setIsOpen(false)}
				confirmButtonHandler={() => {
					if (filePath) {
						onChange(filePath);
					}
					setIsOpen(false);
				}}
				buttonDisabled={[false, !filePath]}
				header="Video hochladen"
				styles={{ width: "360px", height: "480px" }}
			>
				<SwitchButtons
					buttonStates={siteStates as SwitchButton[]}
					currentStates={siteState}
					changeHandler={(value) => setSiteState(value)}
				/>
				{siteState.value === "video" && (
					<div>
						{filePath && (
							<video
								src={getImageUrlFromBytescale({ filePath })}
								controls
							/>
						)}
					</div>
				)}
				{siteState.value === "upload" && (
					<UploadDropzone
						options={options}
						onComplete={(value) => {
							const path = value[0]?.filePath || null;
							setFilePath(path);
							if (path) {
								setSiteState({
									value: "video",
									label: "Video"
								});
							}
						}}
						width="600px"
						height="375px"
					/>
				)}
			</Modal>
		</div>
	);
};

export default TableColumnVideo;
