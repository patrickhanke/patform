import { Modal } from "@repo/ui";
import { useState } from "react";
import {
	UploadDropzone,
	UploadDropzoneConfig
} from "@bytescale/upload-widget-react";
import { useAppContext } from "@repo/provider";

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

console.log(process.env.BYTESCALE_PUBLIC_KEY);

const TableColumnVideo = ({ value }: { value: string }) => {
	const { project } = useAppContext();
	const [isOpen, setIsOpen] = useState(false);
	const options: UploadDropzoneConfig = {
		apiKey: process.env.BYTESCALE_PUBLIC_KEY as string,
		// accountId: process.env.BYTESCALE_ACCOUNT_ID as string,
		locale: myCustomLocale, // EN_US by default. (See "Localization" section below.)
		maxFileCount: 1,
		mimeTypes: ["video/*"],
		multi: false, // False by default.
		showFinishButton: true, // Show/hide the "finish" button in the widget.
		showRemoveButton: true, // Show/hide the "remove" button next to each file.
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
				base: 16 // Base font size (px).
			}
		},

		path: {
			fileName: "{ORIGINAL_FILE_NAME}{ORIGINAL_FILE_EXT}",
			folderPath: `/patstore/${project?.path ?? "unbestimmt"}/videos`
		}
	};
	return (
		<div>
			<button onClick={() => setIsOpen(true)}>Video hochladen</button>
			<Modal
				isOpen={isOpen}
				cancelButtonHandler={() => setIsOpen(false)}
				confirmButtonHandler={() => {}}
				header="Video hochladen"
			>
				<UploadDropzone
					options={options}
					onUpdate={({ uploadedFiles }) => {
						console.log(
							uploadedFiles.map((x) => x.fileUrl).join("\n")
						);
					}}
					width="600px"
					height="375px"
				/>
			</Modal>
		</div>
	);
};

export default TableColumnVideo;
